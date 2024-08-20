// backend/games/gameRoutes.ts
import express, { Request, Response } from 'express';
import {
  getRandomGame,
  getRandomGameRated,
  getGameById,
} from './gameController.js';

const router = express.Router();

// Get a random game
router.get('/random', (req: Request, res: Response) => {
  getRandomGame(req, res);
});

// Get a random rated game by rating
router.get('/random-rated/:rating', (req: Request, res: Response) => {
  getRandomGameRated(req, res);
});

// Get a single game by ID
router.get('/:id', (req: Request, res: Response) => {
  getGameById(req, res);
});

export default router;
