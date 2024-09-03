import { Request, Response } from 'express';
import {
  analyzeGame,
  analyzeMove,
  DEEP_DEPTH,
  MoveAnalysis,
  SHALLOW_DEPTH,
} from './analyzeService';

const INACCURACY_DIFF = 50;

export const analyzeGameEndpoint = async (req: Request, res: Response) => {
  const { moves } = req.body;

  try {
    const movesAnalysis = await analyzeGame(moves, SHALLOW_DEPTH);
    const movesReanalysis = await Promise.all(
      movesAnalysis
        .filter((move) => move.diff > INACCURACY_DIFF)
        .map(
          async (move) => await analyzeMove(move.fen, move.move, DEEP_DEPTH),
        ),
    );
    const mistakes = movesReanalysis.filter(
      (move) => move.diff > INACCURACY_DIFF,
    );
    res.json(mistakes);
  } catch (error) {
    console.error('Error analyzing game:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while analyzing the game.' });
  }
};
