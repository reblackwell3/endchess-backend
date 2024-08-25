// backend/players/playerRoutes.ts
import express, { Request, Response } from 'express';
import {
  getPlayerByUserId,
  updatePlayerElo,
  addCompletedPuzzle,
  addCompletedGame,
} from './playerController';

const router = express.Router();

router.get('/:userId', (req: Request, res: Response) => {
  getPlayerByUserId(req, res);
});

router.put('/:userId/elo', (req: Request, res: Response) => {
  updatePlayerElo(req, res);
});

router.put('/:userId/completed', (req: Request, res: Response) => {
  addCompletedPuzzle(req, res);
});

router.put('/:userId/completed-game', (req: Request, res: Response) => {
  addCompletedGame(req, res);
});

export default router;
