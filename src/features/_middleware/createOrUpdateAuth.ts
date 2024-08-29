import { Request, Response, NextFunction } from 'express';
import User from '../user/userModel'; // Adjust the import path as needed
import Player from '../user/playerModel'; // Adjust the import path as needed

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
    let user = await User.findOne({ providerId, provider });

    if (user) {
      // Update the existing auth record with new token data
      user.accessToken = accessToken || user.accessToken;
      await user.save();
    } else {
      // Usage example
      const playerData = { userId: providerId };
      const player = await findOneOrCreate({ userId: providerId }, playerData);

      // Create a new auth record with all available fields
      user = new User({
        playerId: player._id,
        provider,
        providerId,
        accessToken: accessToken,
        refreshToken: 'default', // Assuming refreshToken is not provided by Google
        email,
        emailVerified,
        name,
        picture,
        givenName,
        familyName,
      });
      await user.save();
    }

    // Attach authRecord to the request object
    (req as any).authRecord = user;

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: 'Failure creating or updating auth' });
  }
};

const findOneOrCreate = async (filter: any, data: any) => {
  const result = await Player.findOneAndUpdate(
    filter,
    { $setOnInsert: data }, // Set the data only if inserting
    { upsert: true, new: true, setDefaultsOnInsert: true }, // Options to control the behavior
  );

  return result;
};
