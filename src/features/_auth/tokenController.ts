// backend/features/tokens/tokenController.ts
import { Request, Response } from 'express';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import Auth from '../_auth/authModel'; // Adjust the import path as needed
import Player from '../players/playerModel'; // Adjust the import path as needed
import fs from 'fs';
import path from 'path';

const endchessPrivateKeyPath = path.join(
  __dirname,
  '../../keys/private_key.pem',
);
const endchessPrivateKey = fs.readFileSync(endchessPrivateKeyPath, 'utf8');

// Controller function for generating a token based on email
export const generateEmailToken = (req: Request, res: Response) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const decodedPayload = buildPayloadForEmail(email);

  const signOptions: SignOptions = {
    algorithm: 'RS256',
    keyid: 'ENDCHESS_KID',
  };

  try {
    const token = jwt.sign(decodedPayload, endchessPrivateKey, signOptions);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Token generation failed', error });
  }
};

// Helper function to build the payload for email-based tokens
function buildPayloadForEmail(email: string) {
  const EMAIL_USER_PLACEHOLDER = 'EMAIL';
  return {
    iss: EMAIL_USER_PLACEHOLDER,
    sub: email, // Subject is the email
    email: email, // Matching the test email
    email_verified: false,
    name: EMAIL_USER_PLACEHOLDER,
    picture: EMAIL_USER_PLACEHOLDER,
    given_name: EMAIL_USER_PLACEHOLDER,
    family_name: EMAIL_USER_PLACEHOLDER,
    isFakeToken: EMAIL_USER_PLACEHOLDER,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1-hour expiration
    jti: EMAIL_USER_PLACEHOLDER,
  };
}
