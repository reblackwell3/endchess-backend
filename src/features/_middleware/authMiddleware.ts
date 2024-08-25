import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// Google OAuth2 public keys endpoint
const GOOGLE_OAUTH2_PUBLIC_KEYS = 'https://www.googleapis.com/oauth2/v3/certs';

// Configure the JWKS client
const client = jwksClient({
  jwksUri: GOOGLE_OAUTH2_PUBLIC_KEYS,
});

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access token missing or invalid' });
  }

  try {
    const decodedHeader: any = jwt.decode(token, { complete: true });

    // Get the kid (key ID) from the token header
    const kid = decodedHeader.header.kid;

    // Get the signing key from Google's public keys
    const signingKey = await client.getSigningKey(kid);
    const publicKey = signingKey.getPublicKey();

    // Verify the token with the public key
    const decoded_token = jwt.verify(token, publicKey, {
      algorithms: ['RS256'], // Google uses RS256
    });

    req.decodedToken = decoded_token; // Attach the user to the request object
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
