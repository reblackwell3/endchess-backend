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
  app.use('/import', importRoutes);
});

describe('Import Controller', () => {
  it('should import games from chess.com', async () => {
    const res = await request(app).post('/import').send({
      other_platform: 'chesscom',
      other_username: 'minhnotminh',
      endchess_username: 'end_minh',
    });
    expect(res.status).toBe(200);
    expect(res.body).not.toBeNull();
    expect(res.body.message).toBe('Chess.com games imported successfully');
  });

  it('should import games from lichess', async () => {
    const res = await request(app).post('/import').send({
      other_platform: 'lichess',
      other_username: 'Minhnotminh',
      endchess_username: 'end_minh',
    });
    expect(res.status).toBe(200);
    expect(res.body).not.toBeNull();
    expect(res.body.message).toBe('Lichess games imported successfully');
  });
});
