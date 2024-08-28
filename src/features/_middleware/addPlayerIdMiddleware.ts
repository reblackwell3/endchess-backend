import { Request, Response, NextFunction } from 'express';
import IAuth from '../user/userModel'; // Adjust the import path as needed

// JWT Secret or Public Key (replace with your setup, if needed)
const JWT_SECRET = 'your_jwt_secret_key'; // Only needed if you're signing JWTs yourself

export const attachPlayerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('player id middleware');
    const authRecord = (req as any).authRecord;

    // Attach the playerId to the request object
    (req as any).playerId = authRecord.playerId;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Token verification or lookup failed:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
