import request from 'supertest';
import express from 'express';
import importRoutes from '../../src/features/import/importRoutes';
import connectDB from '../../src/config/db';
import Game from '../../src/features/games/gameModel';
import Player from '../../src/features/user/playerModel';
import dotenv from 'dotenv';
import User from '../../src/features/user/userModel';
import mockUser from '../__mocks__/mockUser';
import mockDetails from '../__mocks__/mockFindOrCreateUserDetails';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

app.use('/import', importRoutes);

const endchess_provider_id = 'end_minh';
const chesscom_username = 'minhnotminh';
const lichess_username = 'Minhnotminh';
const CHESSCOM_GAMES_NUM = 16;
const LICHESS_GAMES_NUM = 1;

beforeAll(async () => {
  await connectDB();
  await Game.deleteMany({
    $or: [
      { 'white.username': chesscom_username },
      { 'black.username': chesscom_username },
      { 'white.username': lichess_username },
      { 'black.username': lichess_username },
    ],
  });
  await User.deleteOne({ provider_id: endchess_provider_id });
  await User.findOrCreate(
    mockDetails.profile,
    mockDetails.accessToken,
    mockDetails.refreshToken,
  );
});

beforeEach(async () => {
  await User.findOneAndUpdate(
    { provider_id: endchess_provider_id },
    { $set: { 'player.importedGames': [] } },
  );
});

describe('Import Controller', () => {
  it('should import games, and verify the data', async () => {
    const chesscomRes = await request(app).post('/import').send({
      other_platform: 'chesscom',
      other_username: chesscom_username,
      endchess_username: endchess_provider_id,
    });

    expect(chesscomRes.status).toBe(200);
    expect(chesscomRes.body).not.toBeNull();
    expect(chesscomRes.body.message).toBe(
      'Chess.com games imported successfully',
    );
    expect(chesscomRes.body.feedback.inserts.length).toBeGreaterThanOrEqual(
      CHESSCOM_GAMES_NUM,
    );

    const updatedPlayer = await Player.findOne({
      userId: endchess_provider_id,
    });
    expect(updatedPlayer).not.toBeNull();
    expect(updatedPlayer!.importedGames.length).toBeGreaterThanOrEqual(
      CHESSCOM_GAMES_NUM,
    );

    const user = await User.findOne({
      providerId: endchess_provider_id,
    }).populate('player'); // q: I want to search inside user and get only imported games
    const importedGames = user!.player.importedGames;
    expect(importedGames.length).toBeGreaterThanOrEqual(CHESSCOM_GAMES_NUM);

    const gamesInDB = await Game.find({
      _id: { $in: importedGames },
    });
    expect(gamesInDB.length).toBe(CHESSCOM_GAMES_NUM);
  });

  it('should import games from lichess and verify', async () => {
    const lichessRes = await request(app).post('/import').send({
      other_platform: 'lichess',
      other_username: lichess_username,
      endchess_username: endchess_provider_id,
    });

    expect(lichessRes.status).toBe(200);
    expect(lichessRes.body).not.toBeNull();
    expect(lichessRes.body.message).toBe('Lichess games imported successfully');
    expect(lichessRes.body.feedback.inserts.length).toBeGreaterThanOrEqual(
      LICHESS_GAMES_NUM,
    );
    const user = await User.findOne({
      providerId: endchess_provider_id,
    }).populate('player'); // q: I want to search inside user and get only imported games
    const importedGames = user!.player.importedGames.length;
    expect(importedGames).toBeGreaterThanOrEqual(LICHESS_GAMES_NUM);

    const gamesInDB = await Game.find({
      _id: { $in: importedGames },
    });
    expect(gamesInDB.length).toBe(LICHESS_GAMES_NUM);
  });
});
