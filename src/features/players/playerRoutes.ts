// backend/players/playerRoutes.ts
import express, { Request, Response } from 'express';
import {
  getPlayerByUserId,
  updatePlayerElo,
  addCompletedPuzzle,
  addCompletedGame,
} from './playerController';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  getPlayerByUserId(req, res);
});

router.put('/elo', (req: Request, res: Response) => {
  updatePlayerElo(req, res);
});

router.put('/completed', (req: Request, res: Response) => {
  addCompletedPuzzle(req, res);
});

router.put('/completed-game', (req: Request, res: Response) => {
  addCompletedGame(req, res);
});

export default router;
