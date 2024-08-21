import request from 'supertest';
import express from 'express';
import playerRoutes from '../../src/features/players/playerRoutes'; // Adjust the path as necessary
import connectDB from '../../src/config/db';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

beforeAll(async () => {
  await connectDB();
  app.use('/api/players', playerRoutes);
});

describe('Players Controller', () => {
  const newUserId = 'jimmy' + Math.random();
  it('should create a new player', async () => {
    const res = await request(app)
      .post('/api/players')
      .send({ userId: newUserId });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('userId', newUserId);
  });

  it('should get user by id', async () => {
    const res = await request(app).get('/api/players/' + newUserId);
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
  });
});
