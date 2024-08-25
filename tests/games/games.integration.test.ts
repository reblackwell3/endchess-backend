import request from 'supertest';
import express from 'express';
import gameRoutes from '../../src/features/games/gameRoutes';
import connectDB from '../../src/config/db';
import { mockBuiltGames } from '../__mocks__/mock-built-games';
import Game from '../../src/features/games/gameModel';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

beforeAll(async () => {
  await connectDB();
  app.use('/games', gameRoutes);
  (await Game.create(mockBuiltGames[0])).save();
});

describe('Games Controller', () => {
  it('should get random game', async () => {
    const res = await request(app).get('/games/random');
    expect(res.status).toBe(200);
    expect(res.body).not.toBeNull();
  });
});
