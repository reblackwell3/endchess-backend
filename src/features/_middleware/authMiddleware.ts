import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Jwt } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import Auth from '../_auth/authModel'; // Adjust the import path as needed
import Player from '../players/playerModel'; // Adjust the import path as needed

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
  console.log('auth middleware');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access token missing or invalid' });
  }

  try {
    const jwtoken = jwt.decode(token, { complete: true }) as Jwt;

    let decodedPayload: JwtPayload;
    if (jwtoken.header.kid === 'testKid') {
      console.log('The token is fake, but for pre-alpha it is accepted');
      decodedPayload = jwtoken.payload as JwtPayload;
    } else {
      // Get the kid (key ID) from the token header
      decodedPayload = await verifyGoogleToken(token, jwtoken.header);
    }

    console.log(`${JSON.stringify(decodedPayload, null, 2)}`);
    (req as any).decodedToken = decodedPayload; // Attach the user to the request object
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  async function verifyGoogleToken(token: string, header: any) {
    const kid = header.kid;

    // Get the signing key from Google's public keys
    const signingKey = await client.getSigningKey(kid!); // "!" asserts that kid is defined
    const publicKey = signingKey.getPublicKey();

    // Verify the token with the public key
    const verifiedToken = jwt.verify(token, publicKey, {
      algorithms: ['RS256'], // Google uses RS256
    }) as JwtPayload;
    return verifiedToken;
  }
};

export const createOrUpdateAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('upsert auth');
  const decodedToken: any = (req as any).decodedToken;

  try {
    const provider = decodedToken.iss;
    const providerId = decodedToken.sub;
    const accessToken = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    const email = decodedToken.email;
    const emailVerified = decodedToken.email_verified;
    const name = decodedToken.name;
    const picture = decodedToken.picture;
    const givenName = decodedToken.given_name;
    const familyName = decodedToken.family_name;

    // Find existing auth record by providerId and provider
    let authRecord = await Auth.findOne({ providerId, provider });

    if (authRecord) {
      // Update the existing auth record with new token data
      authRecord.accessToken = accessToken || authRecord.accessToken;
      authRecord.updatedAt = new Date();
      await authRecord.save();
    } else {
      // Create a new player (if needed)
      const player = new Player({ userId: providerId });
      await player.save();

      // Create a new auth record with all available fields
      authRecord = new Auth({
        playerId: player._id,
        provider,
        providerId,
        accessToken: accessToken || '',
        refreshToken: '', // Assuming refreshToken is not provided by Google
        email,
        emailVerified,
        name,
        picture,
        givenName,
        familyName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await authRecord.save();
    }

    // Attach authRecord to the request object
    (req as any).authRecord = authRecord;

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: 'Failure creating or updating auth' });
  }
};
