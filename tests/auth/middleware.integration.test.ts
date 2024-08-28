import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { authenticateToken } from '../../src/features/_middleware/authenticateToken';
import { attachPlayerId } from '../../src/features/_middleware/addPlayerIdMiddleware';
import { createOrUpdateAuth } from '../../src/features/_middleware/createOrUpdateAuth';
import User from '../../src/features/user/userModel';
import Player from '../../src/features/players/playerModel';
import connectDB from '../../src/config/db';
import dotenv from 'dotenv';
import jwt, { SignOptions } from 'jsonwebtoken';

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

app.post(
  '/test-all-middleware',
  authenticateToken,
  createOrUpdateAuth,
  attachPlayerId,
  (req, res) => {
    res.json({
      playerId: (req as any).playerId,
      authRecord: (req as any).authRecord,
    });
  },
);

const testProviderId = 'testProviderId_12894589239';
const testEmail = 'test_123908421390@example.com';

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  // Clean up the Auth and Player records related to the test user
  await User.deleteOne({ providerId: testProviderId });
  await Player.deleteOne({ userId: testProviderId });
});

afterAll(async () => {
  // Clean up the Auth and Player records related to the test user after all tests
  await User.deleteOne({ providerId: testProviderId });
  await Player.deleteOne({ userId: testProviderId });
});

describe('Auth Middleware Integration Tests', () => {
  it('should create an Auth record and a Player record', async () => {
    const mockTokenPayload = {
      iss: 'fake-issuer',
      sub: testProviderId, // Matching the test provider ID
      email: testEmail, // Matching the test email
      email_verified: true,
      name: 'Test User',
      picture: 'https://example.com/test-picture.png',
      given_name: 'Test',
      family_name: 'User',
      isFakeToken: true,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1-hour expiration
      jti: 'fake-jti',
    };

    // Load the RSA private key from the file
    const privateKey = fs.readFileSync(
      path.join(__dirname, '../../fake_login_keys/private_key.pem'),
      'utf8',
    );

    const signOptions: SignOptions = {
      algorithm: 'RS256',
      keyid: 'fakeEndchessKid',
    };

    // Generate the token with the custom header
    const mockToken = jwt.sign(mockTokenPayload, privateKey, signOptions);

    const response = await request(app)
      .post('/test-all-middleware')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('playerId');
    expect(response.body).toHaveProperty('authRecord');

    // Verify that the Auth record was created
    const authRecord = await User.findOne({ providerId: testProviderId });
    expect(authRecord).not.toBeNull();
    expect(authRecord?.email).toBe(testEmail);

    // Verify that the Player record was created
    const playerRecord = await Player.findOne({ userId: testProviderId });
    expect(playerRecord).not.toBeNull();
    expect(playerRecord?.userId).toBe(testProviderId);
  });
});
