import request from 'supertest';
import express, { Request, Response } from 'express';
import { authenticateToken } from '../../src/features/_middleware/authMiddleware';
import { createOrUpdateAuth } from '../../src/features/_middleware/authMiddleware';
import { attachPlayerId } from '../../src/features/_middleware/addPlayerIdMiddleware';
import Auth from '../../src/features/_auth/authModel';
import Player from '../../src/features/players/playerModel';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn().mockReturnValue({
    header: { kid: 'fakeEndchessKid' },
    payload: {
      iss: 'fake-issuer',
      sub: 'test-user',
      email: 'test@example.com',
      email_verified: true,
      name: 'Test User',
      picture: 'https://example.com/test-picture.png',
      given_name: 'Test',
      family_name: 'User',
      isFakeToken: true,
      iat: 1724689846,
      exp: 1724693446,
      jti: 'fake-jti',
    },
    signature: 'fake-signature',
  }),
  verify: jest.fn(),
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

describe('Fake Token Auth Middleware Unit Test', () => {
  it('should accept a fake token', async () => {
    const fakeToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZha2VFbmRoY2hlc3NLaWQifQ.eyJpc3MiOiJmYWtlLWlzc3VlciIsInN1YiI6InJzbmVpbiIsImVtYWlsIjoicnNuZWluQGZha2UuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJyc25laW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9mYWtlLXBpY3R1cmUucG5nIiwiZ2l2ZW5fbmFtZSI6ImZha2UiLCJmYW1pbHlfbmFtZSI6Im5vdF9yZWFsIiwiaXNGYWtlVG9rZW4iOnRydWUsImlhdCI6MTcyNDY4OTc2OSwiZXhwIjoxNzI0NjkzMzY5LCJqdGkiOiJmYWtlLWp0aSJ9.fake-signature';
    const response = await request(app)
      .post('/auth')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({});
    expect(response.status).toBe(200);
  });
});
