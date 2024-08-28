import { readGamesFromChessCom } from './chessComImportService';
import { readGamesFromLichess } from './lichessImportService';
import { SaveFeedback } from './importService';
import { Request, Response } from 'express';

export async function importGames(req: Request, res: Response): Promise<void> {
  const { other_platform, other_username, endchess_username } = req.body;

  try {
    let feedback: SaveFeedback;
    switch (other_platform) {
      case 'chesscom':
        feedback = await readGamesFromChessCom(
          other_username,
          endchess_username,
        );
        res.status(200).json({
          message: 'Chess.com games imported successfully',
          feedback: feedback,
        });
        break;
      case 'lichess':
        feedback = await readGamesFromLichess(
          other_username,
          endchess_username,
        );
        res.status(200).json({
          message: 'Lichess games imported successfully',
          feedback: feedback,
        });
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
