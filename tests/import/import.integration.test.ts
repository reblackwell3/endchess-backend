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

beforeAll(async () => {
  await connectDB();
  app.use('/import', importRoutes);

  // Insert a player for the user before running the tests
  const endchess_username = 'end_minh';
  await Player.create({
    userId: endchess_username,
    elo: 1500, // Set any initial elo value
    importedGames: [],
    puzzlesCompleted: [],
  });
});

afterAll(async () => {
  await Game.deleteMany({});
  await Player.deleteMany({});
});

describe('Import Controller', () => {
  it('should delete existing games for the user, import new games, and verify the data', async () => {
    const endchess_username = 'end_minh';

    // Step 1: Retrieve savedGameIds from the Player document
    const player = await Player.findOne({ username: endchess_username });
    if (player && player.importedGames && player.importedGames.length > 0) {
      const savedGameIds = player.importedGames;

      // Step 2: Delete those games from the Game collection
      await Game.deleteMany({ _id: { $in: savedGameIds } });

      // Clear the importedGames array from the Player document
      player.importedGames = [];
      await player.save();
    }

    // Step 3: Trigger the import from chess.com
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

    // Step 4: Verify that the games are imported and associated with the player
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
    const endchess_username = 'end_minh';

    // Step 3: Trigger the import from lichess
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
    // Step 4: Verify that the games are imported and associated with the player
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
