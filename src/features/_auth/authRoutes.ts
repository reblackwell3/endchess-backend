import { Request, Response, Router } from 'express';
import passport from './passportConfig';
import { IUser } from '../user/userModel';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google'),
  setUserIDResponseCookie,
  (req: Request, res: Response, next) => {
    // if success
    if (req.user) {
      res.redirect(`${process.env.REACT_APP_URL}/login-success`);
    } else {
      res.redirect(`${process.env.REACT_APP_URL}/login-failed`);
    }
    next();
  },
);

// *** TODO this needs to be improved
router.delete('/cookie', (req: Request, res: Response) => {
  res.clearCookie('myapp-userid');
  res.sendStatus(200);
});

function setUserIDResponseCookie(req: Request, res: Response, next: Function) {
  // *** TODO this can have a key for security
  const user = req.user as IUser;
  if (user.id != req.cookies['myapp-userid']) {
    if (req.user) {
      res.cookie('myapp-userid', user.accessToken, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // expires 3 days from now
        signed: true,
      });
    } else {
      res.clearCookie('myapp-userid');
    }
  }
  next();
}

// router.get(
//   '/facebook',
//   passport.authenticate('facebook', { scope: ['email'] }),
// );
// router.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/' }),
//   (req: Request, res: Response) => {
//     res.redirect('/');
//   },
// );

// router.get('/apple', passport.authenticate('apple'));
// router.post(
//   '/apple/callback',
//   passport.authenticate('apple', { failureRedirect: '/' }),
//   (req: Request, res: Response) => {
//     res.redirect('/');
//   },
// );

export default router;
