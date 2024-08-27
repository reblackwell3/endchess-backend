// backend/features/tokens/tokenController.ts
import { Request, Response } from 'express';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import Auth from '../_auth/authModel'; // Adjust the import path as needed
import Player from '../players/playerModel'; // Adjust the import path as needed
import fs from 'fs';
import path from 'path';

// Controller function for generating a token based on email
export const generateEmailToken = (req: Request, res: Response) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const decodedPayload = buildPayloadForEmail(email);

  const privateKey = process.env.PRIVATE_KEY as string;

  const signOptions: SignOptions = {
    algorithm: 'RS256',
    keyid: 'EMAIL_USER_PLACEHOLDER',
  };

  const token = jwt.sign(decodedPayload, privateKey, signOptions);

  res.status(200).json({ token });
};

// Controller function for generating a token based on Google authentication
export const generateGoogleToken = async (req: Request, res: Response) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decodedHeader = jwt.decode(token, { complete: true }) as JwtPayload;

    if (!decodedHeader || !decodedHeader.header.kid) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const decodedPayload = await verifyGoogleToken(token, decodedHeader.header);

    const privateKey = process.env.PRIVATE_KEY as string;

    const signOptions: SignOptions = {
      algorithm: 'RS256',
      keyid: decodedHeader.header.kid,
    };

    const newToken = jwt.sign(decodedPayload, privateKey, signOptions);

    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token', error });
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

// Helper function to verify Google token using JWKS
async function verifyGoogleToken(token: string, header: any) {
  const GOOGLE_OAUTH2_PUBLIC_KEYS =
    'https://www.googleapis.com/oauth2/v3/certs';
  const client = jwksClient({
    jwksUri: GOOGLE_OAUTH2_PUBLIC_KEYS,
  });

  const kid = header.kid;

  const signingKey = await client.getSigningKey(kid!); // "!" asserts that kid is defined
  const publicKey = signingKey.getPublicKey();

  const verifiedToken = jwt.verify(token, publicKey, {
    algorithms: ['RS256'], // Google uses RS256
  }) as JwtPayload;

  return verifiedToken;
}
