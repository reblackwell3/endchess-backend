import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import puzzleRoutes from '../../src/features/puzzles/puzzleRoutes.js'; // Adjust the path as necessary
import connectDB from '../../src/config/db.js';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

before(async () => {
  await connectDB();
  app.use('/api/puzzles', puzzleRoutes);
});

describe('Puzzles Controller', () => {
  it('should get random puzzle', async () => {
    const res = await request(app).get('/api/puzzles/random');
    expect(res.status).to.equal(200);
  });
});
