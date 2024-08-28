// backend/puzzles/puzzleRoutes.ts
import express, { Request, Response } from 'express';
import {
  getRandomPuzzle,
  getRandomPuzzleRated,
  getNextPuzzle,
  getPuzzleById,
} from './puzzleController';

const router = express.Router();

// Get a random puzzle
router.get('/random', (req: Request, res: Response) => {
  getRandomPuzzle(req, res);
});

router.get('/random-rated/:rating', (req: Request, res: Response) => {
  getRandomPuzzleRated(req, res);
});

// Get the next puzzle based on elo and player ID
router.get('/next', (req: Request, res: Response) => {
  getNextPuzzle(req, res);
});

// Get a single puzzle by ID
router.get('/:id', (req: Request, res: Response) => {
  getPuzzleById(req, res);
});

export default router;
