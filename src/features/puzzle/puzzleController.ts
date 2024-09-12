import { Request, Response } from 'express';
import { IUser, IPlayerData } from 'endchess-models';
import { PuzzleSettingsDto } from 'endchess-api-settings';
import service from './puzzlesService';
class PuzzleController {
  public async getPuzzle(req: Request, res: Response): Promise<void> {
    try {
      console.log(`req.user: ${req.user}`);
      const user = req.user as IUser;
      const settings: PuzzleSettingsDto = JSON.parse(
        req.headers.settings as string,
      );
      const puzzle = await service.findPuzzle(user, settings);
      if (puzzle) {
        res.json(puzzle);
      } else {
        res.status(404).json({ message: 'Puzzle not found' });
      }
    } catch (err) {
      const error = err as Error;
      res.status(500).json({ message: error.message });
    }
  }
}

export default new PuzzleController();
