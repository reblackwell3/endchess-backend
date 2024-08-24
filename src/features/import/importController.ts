import { readGamesFromChessCom } from './chessComImportService';
import { readGamesFromLichess } from './lichessImportService';
import { Request, Response } from 'express';

export async function importGames(req: Request, res: Response): Promise<void> {
  const { other_platform, other_username, endchess_username } = req.body;

  try {
    switch (other_platform) {
      case 'chesscom':
        await readGamesFromChessCom(other_username, endchess_username);
        res
          .status(200)
          .json({ message: 'Chess.com games imported successfully' });
        break;
      case 'lichess':
        await readGamesFromLichess(other_username, endchess_username);
        res
          .status(200)
          .json({ message: 'Lichess games imported successfully' });
        break;
      default:
        res.status(400).json({ error: 'Unsupported platform' });
        break;
    }
  } catch (error) {
    console.error(`Error importing games from ${other_platform}:`, error);
    res
      .status(500)
      .json({ error: `Failed to import games from ${other_platform}` });
  }
}
