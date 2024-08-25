import { Request, Response, NextFunction } from 'express';
import Auth, { IAuth } from './authModel';
import Player from '../players/playerModel';
import { Types } from 'mongoose';

// Define types for request body
interface AuthRequestBody {
  provider: string;
  providerId: string;
  accessToken: string;
  refreshToken: string;
}

// Define types for request params
export interface AuthRequestParams {
  providerId: string;
  provider: string;
  playerId: Types.ObjectId;
}

// Create or update an auth record
export const createOrUpdateAuth = async (
  req: Request<{}, {}, AuthRequestBody>,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { provider, providerId, accessToken, refreshToken } = req.body;

  try {
    // Find existing auth record by providerId and provider
    let authRecord = (await Auth.findOne({
      providerId,
      provider,
    })) as IAuth | null;

    if (authRecord) {
      // Update the access and refresh tokens
      authRecord.accessToken = accessToken;
      authRecord.refreshToken = refreshToken;
      //   authRecord.updatedAt = new Date();
      await authRecord.save();

      return res.status(200).json(authRecord);
    } else {
      // Create a new player (if needed)
      const player = new Player({ userId: providerId });
      await player.save();

      // Create a new auth record
      authRecord = new Auth({
        player: player._id,
        provider,
        providerId,
        accessToken,
        refreshToken,
      });

      await authRecord.save();

      return res.status(201).json(authRecord);
    }
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: error.message });
  }
};

// Get auth record by providerId and provider
export const getAuthByProviderId = async (
  req: Request<AuthRequestParams>,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { providerId, provider } = req.params;

  try {
    const authRecord = await Auth.findOne({
      providerId,
      provider,
    });

    if (!authRecord) {
      return res.status(404).json({ error: 'Auth record not found' });
    }

    return res.status(200).json(authRecord);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: error.message });
  }
};
