import { Request, Response } from 'express';
import { IUser, IPlayerData, PlayerData } from 'endchess-models';
import { findPuzzle } from './puzzleRepo';
import { PuzzleSettings, PuzzleSettingsDto } from 'endchess-api-settings';
import { calculateRatingRange } from './puzzleConfigService';

export const getPuzzle = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(`req.user: ${req.user}`);
    const user = req.user as IUser;
    const playerData = req.playerData as IPlayerData;
    const settings: PuzzleSettingsDto = JSON.parse(
      req.headers.settings as string,
    );
    const ratingRange = calculateRatingRange(user., settings.difficulty!);
    const puzzle = await findPuzzle(user, settings.difficulty!);
    if (puzzle) {
      res.json(puzzle);
    } else {
      res.status(404).json({ message: 'Puzzle not found' });
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
