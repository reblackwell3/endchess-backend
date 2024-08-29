import { Request, Response, NextFunction } from 'express';
import passport from '../_auth/passportConfig.app';

export const authenticateCookie = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    'cookie',
    { session: false },
    (err: Error, user: any) => {
      if (err) return next(err);
      if (!user) return res.sendStatus(401);
      req.user = user;
      next();
    },
  )(req, res, next);
};
