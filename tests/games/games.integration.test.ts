import request from 'supertest';
import express from 'express';
import gameRoutes from '../../src/features/games/gameRoutes';
import connectDB from '../../src/config/db';
import { mockBuiltGames } from '../__mocks__/mockBuiltGames';
import Game from '../../src/features/games/gameModel';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

beforeAll(async () => {
  await connectDB();
  app.use('/games', gameRoutes);

  const game = mockBuiltGames[0];
  await Game.updateOne(
    { url: game.url }, // Filter by a unique field like `uuid`
    { $setOnInsert: game }, // Only set this if inserting
    { upsert: true }, // Perform insert if no document matches the filter
  );
});

describe('Games Controller', () => {
  it('should get random game', async () => {
    const res = await request(app).get('/games/random');
    expect(res.status).toBe(200);
    expect(res.body).not.toBeNull();
  });
});
