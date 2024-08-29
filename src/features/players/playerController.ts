import Player from '../user/playerModel';
import { Request, Response } from 'express';

// @desc    Get a single player by userId
// @route   GET /players/:userId
// @access  Public
export const getPlayerByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.params.userId });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
    } else {
      res.json(player);
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a player's ELO
// @route   PUT /players/:userId/elo
// @access  Public
export const updatePlayerElo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.params.userId });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
    } else {
      // Update player's ELO
      player.elo = req.body.elo;

      const updatedPlayer = await player.save();
      res.json(updatedPlayer);
    }
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add a completed puzzle to a player
// @route   PUT /players/:userId/completed
// @access  Public
export const addCompletedPuzzle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log(req.body);
    const player = await Player.findOne({ userId: req.params.userId });
    console.log(player);
    const puzzleId = req.body.puzzleId;
    console.log(puzzleId);
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
    } else {
      // Add puzzle to the completed puzzles list
      player.puzzlesCompleted.push(puzzleId);

      const updatedPlayer = await player.save();
      res.json(updatedPlayer);
    }
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add a completed game to a player
// @route   PUT /players/:userId/completed-game
// @access  Public
export const addCompletedGame = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log(req.body);
    const player = await Player.findOne({ userId: req.params.userId });
    console.log(player);
    const gameId = req.body.gameId;
    console.log(gameId);
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
    } else {
      // Add game to the completed games list
      player.gamesCompleted.push(gameId);

      const updatedPlayer = await player.save();
      res.json(updatedPlayer);
    }
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};
