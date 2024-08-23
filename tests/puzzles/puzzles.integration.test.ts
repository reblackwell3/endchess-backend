import request from 'supertest';
import express from 'express';
import puzzleRoutes from '../../src/features/puzzles/puzzleRoutes'; // Adjust the path as necessary
import connectDB from '../../src/config/db';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

beforeAll(async () => {
  await connectDB();
  app.use('/puzzles', puzzleRoutes);
});

describe('Puzzles Controller', () => {
  it('should get random puzzle', async () => {
    const res = await request(app).get('/puzzles/random');
    expect(res.status).toBe(200);
  });
});
