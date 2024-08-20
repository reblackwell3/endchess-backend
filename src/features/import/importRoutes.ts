// backend/import/importRoutes.ts
import express, { Request, Response } from 'express';
import {
  importChesscomGames,
  importLichessGames,
} from './importController.js';

const router = express.Router();

// Route to import games from Chess.com by username
router.get('/chesscom/:username', (req: Request, res: Response) => {
  importChesscomGames(req, res);
});

// Route to import games from Lichess by username
router.get('/lichess/:username', (req: Request, res: Response) => {
  importLichessGames(req, res);
});

export default router;
