import express, { Request, Response } from 'express';
import { analyzeGame } from './analyzeController';

const router = express.Router();

// router.post('/moves', (req: Request, res: Response) => {
//   analyzeGameFromMoves(req, res);
// });

router.post('/pgn', (req: Request, res: Response) => {
  analyzeGame(req, res);
});

export default router;
