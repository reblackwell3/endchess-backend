// backend/server.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { connectDB, closeDB } from '../../src/config/db';
import User from '../../src/features/user/userModel';
import cookieSignature from 'cookie-signature';
import mockDetails from '../__mocks__/mockFindOrCreateUserDetails';

import request from 'supertest';
import app from '../../src/app';

describe('Cookie API Calls Integration Tests', () => {
  let signedCookie: string;
  beforeAll(async () => {
    await connectDB();
    await User.deleteOne({ providerId: mockDetails.profile.id }); // Clear the User collection before tests
    const user = await User.findOrCreate(
      mockDetails.profile,
      mockDetails.accessToken,
      mockDetails.refreshToken,
    ); // Create a mock user
    signedCookie = `s:${cookieSignature.sign(user!.accessToken, process.env.COOKIE_SECRET!)}`;
  });

  afterAll(async () => {
    await closeDB();
    await store.client.close();
  });

  it('should be able to get a random puzzle', async () => {
    const res = await request(app)
      .get('/puzzles/random')
      .set('Cookie', `endchess-token=${signedCookie}`);

    expect(res.status).toBe(200);
  });

  // Add tests for your GET endpoints here
  it('should be able to get a random game', async () => {
    const res = await request(app)
      .get('/games/random')
      .set('Cookie', `endchess-token=${signedCookie}`);

    expect(res.status).toBe(200);
    // Add more assertions based on the expected response
  });
});
