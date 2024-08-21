import request from 'supertest';
import express from 'express';
import importRoutes from '../../src/features/import/importRoutes';
import connectDB from '../../src/config/db';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

beforeAll(async () => {
  await connectDB();
  app.use('/api/import', importRoutes);
});

describe('Import Controller', () => {
  it('should load games from chess.com', async () => {
    const res = await request(app).get('/api/import/chesscom/minhnotminh');
    expect(res.status).toBe(200);
    expect(res.body).not.toBeNull();
  });

  it('should load games from lichess', async () => {
    const res = await request(app).get('/api/import/lichess/minhnotminh');
    expect(res.status).toBe(200);
    expect(res.body).not.toBeNull();
  });
});
