// tests/interactions.test.mjs
import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import interactionsRoutes from '../../src/features/interactions/interactionsRoutes.mjs.js'; // Adjust the path as necessary
import mongoose from 'mongoose';
import connectDB from '../../src/config/db.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

before(async () => {
  await connectDB();
  app.use('/api', interactionsRoutes);
});

describe('Interactions Controller', () => {
  it('should create or update a user interaction', async () => {
    const res = await request(app).post('/api/interactions/testuser').send({
      featureName: 'solve_puzzles',
      featureId: 'puzzle001',
      result: 'success',
    });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Interaction updated successfully');
  });

  it('should get all interactions for a user', async () => {
    const res = await request(app).get('/api/interactions/testuser');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('username', 'testuser');

    // Convert interactions to a Map
    const interactions = new Map(Object.entries(res.body.interactions));

    // Access solve_puzzles
    const solvePuzzles = interactions.get('solve_puzzles');
    expect(solvePuzzles[0]).to.have.property('feature_id', 'puzzle001');
    expect(solvePuzzles[0].interactions[0]).to.have.property(
      'result',
      'success',
    );
  });

  it('should create or update specific feature interaction', async () => {
    const res = await request(app)
      .post('/api/interactions/testuser/solve_puzzles/puzzle002')
      .send({
        result: 'fail',
      });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      'Feature interaction updated successfully',
    );
  });

  it('should get specific feature interactions for a user', async () => {
    const res = await request(app).get(
      '/api/interactions/testuser/solve_puzzles/puzzle002',
    );
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('feature_id', 'puzzle002');
    expect(res.body.interactions[0]).to.have.property('result', 'fail');
  });

  it('should get all interactions for a user and feature', async () => {
    const res = await request(app).get('/api/int/testuser/solve_puzzles');
    expect(res.status).to.equal(200);
    const solvePuzzles = res.body;
    expect(solvePuzzles).to.be.an('array');
    expect(solvePuzzles[0]).to.have.property('feature_id', 'puzzle001');
    expect(solvePuzzles[0].interactions[0]).to.have.property(
      'result',
      'success',
    );
  });
});
