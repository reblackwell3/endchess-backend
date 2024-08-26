import request from 'supertest';
import express, { Request, Response } from 'express';
import { authenticateToken } from '../../src/features/_middleware/authMiddleware';
import { createOrUpdateAuth } from '../../src/features/_middleware/authMiddleware';
import { attachPlayerId } from '../../src/features/_middleware/addPlayerIdMiddleware';

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

app.post('/auth', authenticateToken, (req: Request, res: Response) => {
  res.json({
    playerId: (req as any).playerId,
    authRecord: (req as any).authRecord,
  });
});

describe('Fake Token Auth Middleware Unit Test', () => {
  it('should accept a fake token', async () => {
    const mockTokenPayload = {
      header: {
        kid: 'fakeEndchessKid',
      },
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
    };

    const base64Encode = (obj: object) => {
      return Buffer.from(JSON.stringify(obj)).toString('base64');
    };

    const fakeToken = base64Encode(mockTokenPayload);
    const response = await request(app)
      .post('/auth')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({});
    expect(response.status).toBe(200);
  });
});
