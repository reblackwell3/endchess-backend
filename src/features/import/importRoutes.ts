import express, { Request, Response } from 'express';
import { importChesscomGames, importLichessGames } from './importController';

const router = express.Router();

router.post('/chesscom', (req: Request, res: Response) => {
  importChesscomGames(req, res);
});

router.post('/lichess', (req: Request, res: Response) => {
  importLichessGames(req, res);
});

export default router;
