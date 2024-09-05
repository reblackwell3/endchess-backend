import express, { Request, Response } from 'express';
import { analyzeGameFromPgn } from './analyzeController';

const router = express.Router();

// router.post('/moves', (req: Request, res: Response) => {
//   analyzeGameFromMoves(req, res);
// });

router.post('/pgn', (req: Request, res: Response) => {
  analyzeGameFromPgn(req, res);
});

export default router;
