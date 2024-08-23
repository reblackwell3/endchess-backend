import { Request, Response } from 'express';
import Puzzle from './puzzleModel';
import Player from '../players/playerModel';

// @desc    Get a random puzzle
// @route   GET /puzzles/random
// @access  Public
export const getRandomPuzzle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const count = await Puzzle.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const puzzle = await Puzzle.findOne().skip(randomIndex);
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

// @desc    Get a random rated puzzle
// @route   GET /puzzles/random-rated/:rating
// @access  Public
export const getRandomPuzzleRated = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const rating = parseInt(req.params.rating, 10);

  try {
    const count = await Puzzle.countDocuments({ Rating: { $gt: rating } });
    const randomIndex = Math.floor(Math.random() * count);
    const puzzle = await Puzzle.findOne({ Rating: { $gt: rating } }).skip(
      randomIndex,
    );
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

// @desc    Get the next puzzle based on elo and player ID
// @route   GET /puzzles/next
// @access  Public
export const getNextPuzzle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { elo, playerId } = req.query;

  try {
    const player = await Player.findById(playerId);
    if (player) {
      const puzzlesCompleted = player.puzzlesCompleted;
      const nextPuzzle = await Puzzle.findOne({
        Rating: { $lte: elo },
        _id: { $nin: puzzlesCompleted },
      }).sort({ Rating: -1 });

      if (nextPuzzle) {
        player.puzzlesCompleted.push(nextPuzzle._id);
        await player.save();
        res.json(nextPuzzle);
      } else {
        res.status(404).json({ message: 'No suitable puzzle found' });
      }
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single puzzle by ID
// @route   GET /puzzles/:id
// @access  Public
export const getPuzzleById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const puzzle = await Puzzle.findById(req.params.id);
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
