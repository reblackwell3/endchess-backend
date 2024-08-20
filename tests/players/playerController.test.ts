import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import playerRoutes from '../../src/features/players/playerRoutes.js'; // Adjust the path as necessary
import connectDB from '../../src/config/db.js';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

before(async () => {
  await connectDB();
  app.use('/api/players', playerRoutes);
});

describe('Players Controller', () => {
  const newUserId = 'jimmy' + Math.random();
  it('should create a new player', async () => {
    const res = await request(app)
      .post('/api/players')
      .send({ userId: newUserId });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('userId', newUserId);
  });

  it('should get user by id', async () => {
    const res = await request(app).get('/api/players/' + newUserId);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object'); // Adjusted to check for an object
  });
});
