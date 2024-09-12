import Game from 'endchess-models';
import { Request, Response } from 'express';
import service from './gameService';
import { GamesSettings, GamesSettingsDto } from 'endchess-api-settings';
import { set } from 'mongoose';

class GameController {
  public async getGame(req: Request, res: Response): Promise<void> {
    try {
      console.log('random game');
      console.log(`req.user: ${req.user}`);
      const settings: GamesSettingsDto = JSON.parse(
        req.headers.settings as string,
      );
      const game = await service.findGame(settings);
      res.json(game);
    } catch (err) {
      const error = err as Error;
      res.status(500).json({ message: error.message });
    }
  }
}

export default new GameController();
