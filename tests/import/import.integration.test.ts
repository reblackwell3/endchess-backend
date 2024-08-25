import request from 'supertest';
import express from 'express';
import importRoutes from '../../src/features/import/importRoutes';
import connectDB from '../../src/config/db';
import Game from '../../src/features/games/gameModel';
import Player from '../../src/features/players/playerModel';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

const endchess_username = 'end_minh';
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
  await Player.updateOne(
    { userId: endchess_username }, // Filter: find the document with the given userId
    { $set: { userId: endchess_username } }, // Update: set the userId (can include other fields to set as well)
    { upsert: true }, // If no document matches the filter, insert a new one
  );

  app.use('/import', importRoutes);
});

beforeEach(async () => {
  await Player.updateOne(
    { userId: endchess_username },
    { $set: { importedGames: [] } },
  );
});

describe('Import Controller', () => {
  it('should import games, and verify the data', async () => {
    const chesscomRes = await request(app).post('/import').send({
      other_platform: 'chesscom',
      other_username: chesscom_username,
      endchess_username,
    });

    expect(chesscomRes.status).toBe(200);
    expect(chesscomRes.body).not.toBeNull();
    expect(chesscomRes.body.message).toBe(
      'Chess.com games imported successfully',
    );
    expect(chesscomRes.body.feedback.inserts.length).toBeGreaterThanOrEqual(
      CHESSCOM_GAMES_NUM,
    );

    const updatedPlayer = await Player.findOne({ userId: endchess_username });
    expect(updatedPlayer).not.toBeNull();
    expect(updatedPlayer!.importedGames.length).toBeGreaterThanOrEqual(
      CHESSCOM_GAMES_NUM,
    );

    const gamesInDB = await Game.find({
      _id: { $in: updatedPlayer!.importedGames },
    });
    expect(gamesInDB.length).toBe(CHESSCOM_GAMES_NUM);
  });

  it('should import games from lichess and verify', async () => {
    const lichessRes = await request(app).post('/import').send({
      other_platform: 'lichess',
      other_username: lichess_username,
      endchess_username,
    });

    expect(lichessRes.status).toBe(200);
    expect(lichessRes.body).not.toBeNull();
    expect(lichessRes.body.message).toBe('Lichess games imported successfully');
    expect(lichessRes.body.feedback.inserts.length).toBeGreaterThanOrEqual(
      LICHESS_GAMES_NUM,
    );
    const updatedPlayer = await Player.findOne({ userId: endchess_username });
    expect(updatedPlayer).not.toBeNull();
    expect(updatedPlayer!.importedGames.length).toBeGreaterThanOrEqual(
      LICHESS_GAMES_NUM,
    );

    const gamesInDB = await Game.find({
      _id: { $in: updatedPlayer!.importedGames },
    });
    expect(gamesInDB.length).toBe(LICHESS_GAMES_NUM);
  });
});
