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
beforeAll(async () => {
  await connectDB();
  await Game.deleteMany({});
  await Player.deleteMany({});

  app.use('/import', importRoutes);

  // Insert a player for the user before running the tests
  await Player.create({ userId: endchess_username });
});

describe('Import Controller', () => {
  it('should import games, and verify the data', async () => {
    const chesscomRes = await request(app).post('/import').send({
      other_platform: 'chesscom',
      other_username: 'minhnotminh',
      endchess_username,
    });

    expect(chesscomRes.status).toBe(200);
    expect(chesscomRes.body).not.toBeNull();
    expect(chesscomRes.body.message).toBe(
      'Chess.com games imported successfully',
    );
    const CHESSCOM_GAMES_NUM = 16;
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
    expect(gamesInDB.length).toBe(updatedPlayer!.importedGames.length);
  });

  it('should import games from lichess and verify', async () => {
    const lichessRes = await request(app).post('/import').send({
      other_platform: 'lichess',
      other_username: 'Minhnotminh',
      endchess_username,
    });

    const LICHESS_GAMES_NUM = 1;
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
    expect(gamesInDB.length).toBe(updatedPlayer!.importedGames.length);
  });
});
