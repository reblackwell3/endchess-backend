import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import tokenRoutes from '../../src/features/_auth/tokenRoutes';

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

app.use('/auth', tokenRoutes);

describe('POST /auth/token-email', () => {
  it('should return a token when a valid email is provided', async () => {
    const response = await request(app)
      .post('/auth/token-email')
      .send({ email: 'example@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
