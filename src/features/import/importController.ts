import { readGamesFromChessCom } from './chessComService'; // Adjust the path if necessary
import { readGamesFromLichess } from './lichessService'; // Adjust the path if necessary
import { Request, Response } from 'express';

export async function importChesscomGames(
  req: Request,
  res: Response,
): Promise<void> {
  const username = req.params.username;

  try {
    await readGamesFromChessCom(username);
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
  const username = req.params.username;

  try {
    await readGamesFromLichess(username);
    res.status(200).json({ message: 'Lichess games imported successfully' });
  } catch (error) {
    console.error('Error importing Lichess games:', error);
    res.status(500).json({ error: 'Failed to import Lichess games' });
  }
}
