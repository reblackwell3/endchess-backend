import request from 'supertest';
import express, { Request, Response } from 'express';
import { authenticateCookie } from '../../src/features/auth/authenticateCookie';
import User from '../../src/features/user/userModel';
import { Types } from 'mongoose';

const app = express();
app.use(express.json());

app.post(
  '/test-authenticate-cookie-middleware-only',
  authenticateCookie,
  (req: Request, res: Response) => {
    res.status(200).send('Authenticated');
  },
);

describe('Authenticate Cookie Unit Tests', () => {
 it('should authenticate using a cookie', async () => {
 }

 it('should not authenticate without a cookie', async () => {
 }

  it('should not authenticate with an invalid cookie', async () => {
  });

});
