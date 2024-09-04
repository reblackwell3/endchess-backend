import { Request, Response } from 'express';
import {
  analyzeGame,
  analyzeGameFromPgn as analyzeGameFromPgnS,
  analyzeMove,
  DEEP_DEPTH,
  SHALLOW_DEPTH,
} from './analyzeService';

const INACCURACY_DIFF = 50;

export const analyzeGameFromMoves = async (req: Request, res: Response) => {
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

export const analyzeGameFromPgn = async (req: Request, res: Response) => {
  const { pgn } = req.body;

  try {
    const movesAnalysis = await analyzeGameFromPgnS(pgn, SHALLOW_DEPTH);
    // const movesReanalysis = await Promise.all(
    //   movesAnalysis
    //     .filter((move) => move.diff > INACCURACY_DIFF)
    //     .map(
    //       async (move) => await analyzeMove(move.fen, move.move, DEEP_DEPTH),
    //     ),
    // );
    // const mistakes = movesReanalysis.filter(
    //   (move) => move.diff > INACCURACY_DIFF,
    // );
    // res.json(mistakes);
  } catch (error) {
    console.error('Error analyzing game:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while analyzing the game.' });
  }
};
