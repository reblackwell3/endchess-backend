import request from 'supertest';
import express from 'express';
import playerRoutes from '../../src/features/players/playerRoutes'; // Adjust the path as necessary
import connectDB from '../../src/config/db';
import Player from '../../src/features/players/playerModel';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());
const GET_USER_ID = 'jimmy';
const CREATE_USER_ID = 'other_user';

beforeAll(async () => {
  await connectDB();
  app.use('/players', playerRoutes);
  await Player.deleteOne({ userId: CREATE_USER_ID });
  await Player.updateOne(
    { userId: GET_USER_ID }, // Filter: find the document with the given userId
    { $set: { userId: GET_USER_ID } }, // Update: set the userId (can include other fields to set as well)
    { upsert: true }, // If no document matches the filter, insert a new one
  );
});

describe('Players Controller', () => {
  it('should create a new player', async () => {
    const res = await request(app)
      .post('/players')
      .send({ userId: 'other_user' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('userId', CREATE_USER_ID);
  });

  it('should get user by id', async () => {
    const res = await request(app).get('/players/' + GET_USER_ID);
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
  });
});
