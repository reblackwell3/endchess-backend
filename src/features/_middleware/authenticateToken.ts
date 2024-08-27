import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import path from 'path';
import fs from 'fs';

// Google OAuth2 public keys endpoint
const GOOGLE_OAUTH2_PUBLIC_KEYS = 'https://www.googleapis.com/oauth2/v3/certs';

// Configure the JWKS client
const client = jwksClient({
  jwksUri: GOOGLE_OAUTH2_PUBLIC_KEYS,
});

// Read the public key from the keys directory
const endchessPublicKeyPath = path.join(__dirname, '../../keys/public_key.pem');
const endchessPublicKey = fs.readFileSync(endchessPublicKeyPath, 'utf8');

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('auth middleware');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access token missing or invalid' });
  }

  try {
    const decodedHeader = jwt.decode(token, { complete: true }) as JwtPayload;

    if (!decodedHeader || !decodedHeader.header.kid) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    if (decodedHeader.header.kid === 'ENDCHESS_KID') {
      jwt.verify(token, endchessPublicKey, {
        algorithms: ['RS256'],
      }) as JwtPayload;
    } else {
      await verifyGoogleToken(token, decodedHeader.header);
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token', error });
  }
};

function verifyEndchessToken(token: any) {}

// Helper function to verify Google token using JWKS
async function verifyGoogleToken(token: string, header: any) {
  const kid = header.kid;

  const signingKey = await client.getSigningKey(kid!); // "!" asserts that kid is defined
  const publicKey = signingKey.getPublicKey();

  jwt.verify(token, publicKey, {
    algorithms: ['RS256'], // Google uses RS256
  }) as JwtPayload;
}
