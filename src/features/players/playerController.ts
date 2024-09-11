import { Request, Response } from 'express';
import { User, IUser } from 'endchess-models';

// @desc    Get a single player by userId
// @route   GET /players
// @access  Public
export const getPlayerByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user as IUser;
    res.json(user.player);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a player's ELO
// @route   PUT /players/elo
// @access  Public
export const updatePlayerElo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user as IUser;
    // Update player's ELO
    user.player.elo = req.body.elo;
    await user.save();
    res.sendStatus(200);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add a completed puzzle to a player
// @route   PUT /players/completed
// @access  Public
export const addCompletedPuzzle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user as IUser;
    user.player.puzzlesCompleted.push(req.body.puzzleId);
    await user.save();
    res.sendStatus(200);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add a completed game to a player
// @route   PUT /players/completed-game
// @access  Public
export const addCompletedGame = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user as IUser;
    user.player.gamesCompleted.push(req.body.gameId);
    await user.save();
    res.sendStatus(200);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};
