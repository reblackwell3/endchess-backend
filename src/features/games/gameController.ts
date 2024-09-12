import Game from 'endchess-models';
import { Request, Response } from 'express';
import { findRandomGame } from './gameService';
import { GamesSettings, GamesSettingsDto } from 'endchess-api-settings';

// @desc    Get a random game
// @route   GET /games/random
// @access  Public
const getRandomGame = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('random game');
    console.log(`req.user: ${req.user}`);
    const settings: GamesSettingsDto = JSON.parse(
      req.headers.settings as string,
    );
    switch 
    GamesSettings.RatingCategory.findRandomGame(settings.type!);
    res.json(game);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a random rated game
// @route   GET /games/random-rated/:rating
// @access  Public
const getRandomGameRated = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const rating = parseInt(req.params.rating, 10);

  try {

    res.json(game);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a game by ID
// @route   GET /games/:id
// @access  Public
const getGameById = async (req: Request, res: Response): Promise<void> => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
    } else {
      res.json(game);
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

export { getRandomGame, getGameById, getRandomGameRated };
