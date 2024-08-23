import request from 'supertest';
import express from 'express';
import gameRoutes from '../../src/features/games/gameRoutes';
import connectDB from '../../src/config/db';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

beforeAll(async () => {
  await connectDB();
  app.use('/games', gameRoutes);
});

describe('Games Controller', () => {
  it('should get random game', async () => {
    const res = await request(app).get('/games/random');
    expect(res.status).toBe(200);
    expect(res.body).not.toBeNull();
  });
});
