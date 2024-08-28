import { Request, Response, Router } from 'express';
import passport from './passportConfig';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => {
    res.redirect('/');
  },
);

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
