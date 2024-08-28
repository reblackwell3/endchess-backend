import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import tokenRoutes from '../../src/features/_auth/authRoutes';
import { authenticateToken } from '../../src/features/_middleware/authenticateCookie';

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

app.use('/auth', tokenRoutes);

app.post('/verify-token', authenticateToken, (req, res) => {
  res.status(200);
});

describe('Token Integration Tests', () => {
  it('should return a token when a valid email is provided', async () => {
    const response = await request(app)
      .post('/auth/token-email')
      .send({ email: 'example@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should verify token', async () => {
    const generateResponse = await request(app)
      .post('/auth/token-email')
      .send({ email: 'example@example.com' });
    const token = generateResponse.body.token;

    const verifyResponse = await request(app).post('/verify-token').send({});
    expect(verifyResponse.status).toBe(200);
  });
});
