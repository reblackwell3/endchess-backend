// src/types/express.d.ts

import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { Types } from 'mongoose';

declare module 'express-serve-static-core' {
  interface Request {
    decodedToken?: string | JwtPayload; // Or a more specific type based on your token payload
    playerId: Types.ObjectId;
  }
}
