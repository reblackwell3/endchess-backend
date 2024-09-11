import Game from 'endchess-models';
import { Request, Response } from 'express';

// @desc    Get a random game
// @route   GET /games/random
// @access  Public
const getRandomGame = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('random game');
    console.log(`req.user: ${req.user}`);
    const count = await Game.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const game = await Game.findOne().skip(randomIndex);
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
    const count = await Game.countDocuments({
      WhiteElo: { $gt: rating },
      BlackElo: { $gt: rating },
    });
    const randomIndex = Math.floor(Math.random() * count);
    const game = await Game.findOne({
      WhiteElo: { $gt: rating },
      BlackElo: { $gt: rating },
    }).skip(randomIndex);
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
