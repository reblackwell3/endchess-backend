import { Request, Response, NextFunction } from 'express';
import Auth from '../_auth/authModel'; // Adjust the import path as needed

// JWT Secret or Public Key (replace with your setup, if needed)
const JWT_SECRET = 'your_jwt_secret_key'; // Only needed if you're signing JWTs yourself

export const attachPlayerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const decodedToken: any = req.user;

    // Find the corresponding auth record using providerId (sub from token)
    const authRecord = await Auth.findOne({
      provider: decodedToken.iss,
      providerId: decodedToken.sub,
    });

    if (!authRecord) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the playerId to the request object
    req.playerId = authRecord.playerId;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Token verification or lookup failed:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
