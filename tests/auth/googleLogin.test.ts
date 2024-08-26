import request from 'supertest';
import express, { Request, Response } from 'express';
import { authenticateToken } from '../../src/features/_middleware/authMiddleware';
import { createOrUpdateAuth } from '../../src/features/_middleware/authMiddleware';
import { attachPlayerId } from '../../src/features/_middleware/addPlayerIdMiddleware';
import Auth from '../../src/features/_auth/authModel';
import Player from '../../src/features/players/playerModel';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

jest.mock('jwks-rsa', () => {
  return jest.fn().mockImplementation(() => ({
    getSigningKey: jest.fn().mockResolvedValue({
      getPublicKey: jest.fn().mockReturnValue('publicKey'),
    }),
  }));
});

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn().mockReturnValue({
    header: { kid: 'googleKid' },
  }),
  verify: jest.fn().mockReturnValue({
    iss: 'https://accounts.google.com',
    sub: '100604868571465174281',
    email: 'reblackwell3@gmail.com',
    email_verified: true,
    name: 'Robert Blackwell',
    picture:
      'https://lh3.googleusercontent.com/a/ACg8ocJFqO3qeA6JftoCX6PzBO3OsQqSfCXc3aUP34NUZC6ghJZIF0hv=s96-c',
    given_name: 'Robert',
    family_name: 'Blackwell',
  }),
}));

const app = express();
app.use(express.json());

app.post(
  '/auth',
  authenticateToken,
  createOrUpdateAuth,
  attachPlayerId,
  (req: Request, res: Response) => {
    res.json({
      playerId: (req as any).playerId,
      authRecord: (req as any).authRecord,
    });
  },
);

describe('Google Auth Middleware Unit Tests', () => {
  const mockTokenPayload = {
    iss: 'https://accounts.google.com',
    azp: '906803804045-red0f0hgb8gchqfd0n8gu049k39bra8e.apps.googleusercontent.com',
    aud: '906803804045-red0f0hgb8gchqfd0n8gu049k39bra8e.apps.googleusercontent.com',
    sub: '100604868571465174281',
    email: 'reblackwell3@gmail.com',
    email_verified: true,
    nbf: 1724706043,
    name: 'Robert Blackwell',
    picture:
      'https://lh3.googleusercontent.com/a/ACg8ocJFqO3qeA6JftoCX6PzBO3OsQqSfCXc3aUP34NUZC6ghJZIF0hv=s96-c',
    given_name: 'Robert',
    family_name: 'Blackwell',
    iat: 1724706343,
    exp: 1724709943,
    jti: 'b6bb2bf2eb50c6bceb0a4a080a423cc352ea505c',
  };
  const base64Encode = (obj: object) => {
    return Buffer.from(JSON.stringify(obj)).toString('base64');
  };

  const mockToken = [
    base64Encode({ alg: 'RS256', typ: 'JWT' }),
    base64Encode(mockTokenPayload),
    'signature-placeholder',
  ].join('.');

  beforeEach(() => {
    jest.spyOn(Auth.prototype, 'save').mockResolvedValue(function (this: any) {
      return this;
    });

    jest.spyOn(Player.prototype, 'save').mockResolvedValue(function (
      this: any,
    ) {
      return this;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass through all middleware and return playerId and authRecord', async () => {
    jest.spyOn(Auth, 'findOne').mockResolvedValue(null);
    jest
      .spyOn(Player, 'findOneAndUpdate')
      .mockResolvedValue(new Player({ userId: mockTokenPayload.sub }));
    const response = await request(app)
      .post('/auth')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('playerId');
    expect(response.body).toHaveProperty('authRecord');
  });

  it('should return 401 if no token is provided', async () => {
    jest.spyOn(Auth, 'findOne').mockResolvedValue(null);

    const response = await request(app).post('/auth').send({});

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token missing or invalid');
  });

  it('should pass if auth record is available', async () => {
    const mockAuthRecord = new Auth({
      _id: new Types.ObjectId(),
      playerId: new Types.ObjectId(),
      provider: 'google',
      providerId: '100604868571465174281',
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
      email: 'reblackwell3@gmail.com',
      emailVerified: true,
      name: 'Robert Blackwell',
      picture:
        'https://lh3.googleusercontent.com/a/ACg8ocJFqO3qeA6JftoCX6PzBO3OsQqSfCXc3aUP34NUZC6ghJZIF0hv=s96-c',
      givenName: 'Robert',
      familyName: 'Blackwell',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(Auth, 'findOne').mockResolvedValue(mockAuthRecord);

    const response = await request(app).post('/auth').send({});

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token missing or invalid');
  });

  it('should return 403 if failure in create or update auth', async () => {
    jest.spyOn(Auth, 'findOne').mockImplementation(() => {
      throw new Error('db failure');
    });

    const response = await request(app)
      .post('/auth')
      .set('Authorization', 'Bearer invalid-token')
      .send({});

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Failure creating or updating auth');
  });

  it('should return 403 if token is invalid', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const response = await request(app)
      .post('/auth')
      .set('Authorization', 'Bearer invalid-token')
      .send({});

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Invalid or expired token');
  });
});
