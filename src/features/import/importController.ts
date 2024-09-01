import { readGamesFromChessCom } from './chessComImportService';
import { readGamesFromLichess } from './lichessImportService';
import { SaveFeedback } from './importService';
import { Request, Response } from 'express';
import { IUser } from '../user/userModel';

export async function importGames(req: Request, res: Response): Promise<void> {
  const { otherPlatform, otherUsername } = req.body;
  const providerId = (req.user as IUser).providerId;

  try {
    let feedback: SaveFeedback;
    switch (otherPlatform) {
      case 'chesscom':
        feedback = await readGamesFromChessCom(otherUsername, providerId);
        res.status(200).json({
          message: 'Chess.com games imported successfully',
          feedback: feedback,
        });
        break;
      case 'lichess':
        feedback = await readGamesFromLichess(otherUsername, providerId);
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
    console.error(`Error importing games from ${otherPlatform}:`, error);
    res
      .status(500)
      .json({ error: `Failed to import games from ${otherPlatform}` });
  }
}
