import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

const authenticateCookie = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    'cookie',
    { session: true },
    (err: Error, user: any) => {
      if (err) return next(err);
      if (!user) return res.sendStatus(401);
      req.user = user;
      next();
    },
  )(req, res, next);
};

export default authenticateCookie;
