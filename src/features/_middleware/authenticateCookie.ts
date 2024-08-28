import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticateCookie = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    'cookie',
    { session: false },
    (err: Error, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.sendStatus(401);
      }
      req.user = user;
      next();
    },
  )(req, res, next);
};
