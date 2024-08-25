import request from 'supertest';
import express from 'express';
import playerRoutes from '../../src/features/players/playerRoutes'; // Adjust the path as necessary
import connectDB from '../../src/config/db';
import Player from '../../src/features/players/playerModel';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());
const testUserId = 'jimmy';

beforeAll(async () => {
  await connectDB();
  app.use('/players', playerRoutes);
  (await Player.create({ userId: testUserId })).save();
});

describe('Players Controller', () => {
  it('should create a new player', async () => {
    const res = await request(app)
      .post('/players')
      .send({ userId: 'other_user' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('userId', 'other_user');
  });

  it('should get user by id', async () => {
    const res = await request(app).get('/players/' + testUserId);
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
  });
});
