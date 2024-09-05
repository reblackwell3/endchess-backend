import { Request, Response } from 'express';
import { analyzeGameFromPgn, analyzeMove } from './analyzeService';

const MISTAKE_DIFF = 100;
const SHALLOW_DEPTH = 8;
const DEEP_DEPTH = 8;

export const analyzeGame = async (req: Request, res: Response) => {
  const { pgn } = req.body;

  try {
    const analysis = await analyzeGameFromPgn(pgn, SHALLOW_DEPTH);
    const reanalysis = await Promise.all(
      analysis
        .filter((move) => move.diff > MISTAKE_DIFF)
        .sort((a, b) => 0.5 - Math.random()) // this is a shuffle meant to provide random parts of the game for study
        .slice(0, 5)
        .map(
          async (move) => await analyzeMove(move.fen, move.move, DEEP_DEPTH),
        ),
    );
    const mistakes = reanalysis.filter((move) => move.diff > MISTAKE_DIFF);
    res.json(mistakes);
  } catch (error) {
    console.error('Error analyzing game:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while analyzing the game.' });
  }
};
