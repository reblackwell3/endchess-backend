// src/types/express.d.ts

import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: string | JwtPayload; // Or a more specific type based on your token payload
  }
}
