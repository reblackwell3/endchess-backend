// backend/puzzles/puzzleRoutes.ts
import express, { Request, Response } from 'express';
import { getPuzzle } from './puzzleController';

const router = express.Router();

// Get a random puzzle
router.get('/', (req: Request, res: Response) => {
  getPuzzle(req, res);
});

export default router;
