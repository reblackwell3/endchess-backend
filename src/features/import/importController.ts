import { readGamesFromChessCom } from './chessComImportService';
import { readGamesFromLichess } from './lichessImportService';
import { Request, Response } from 'express';

export async function importChesscomGames(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await readGamesFromChessCom(
      req.body.chesscom_username,
      req.body.endchess_username,
    );
    res.status(200).json({ message: 'Chess.com games imported successfully' });
  } catch (error) {
    console.error('Error importing Chess.com games:', error);
    res.status(500).json({ error: 'Failed to import Chess.com games' });
  }
}

export async function importLichessGames(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await readGamesFromLichess(
      req.body.lichess_username,
      req.body.endchess_username,
    );
    res.status(200).json({ message: 'Lichess games imported successfully' });
  } catch (error) {
    console.error('Error importing Lichess games:', error);
    res.status(500).json({ error: 'Failed to import Lichess games' });
  }
}
