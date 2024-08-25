import request from 'supertest';
import express from 'express';
import puzzleRoutes from '../../src/features/puzzles/puzzleRoutes'; // Adjust the path as necessary
import connectDB from '../../src/config/db';

import dotenv from 'dotenv';
import Puzzle from '../../src/features/puzzles/puzzleModel';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

const testPuzzleData = {
  PuzzleId: 'abc123',
  FEN: 'rnbqkb1r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKB1R w KQkq - 0 1',
  Moves: 'e2e4 e7e5 g1f3',
  Rating: 1500,
  RatingDeviation: 200,
  Popularity: 100,
  NbPlays: 5000,
  Themes: 'middlegame,endgame',
  GameUrl: 'https://www.chess.com/game123',
  OpeningTags: 'Sicilian Defense',
};

beforeAll(async () => {
  await connectDB();
  app.use('/puzzles', puzzleRoutes);
  await Puzzle.updateOne(
    { PuzzleId: testPuzzleData.PuzzleId },
    { $set: testPuzzleData },
    { upsert: true },
  );
});

describe('Puzzles Controller', () => {
  it('should get random puzzle', async () => {
    const res = await request(app).get('/puzzles/random');
    expect(res.status).toBe(200);
  });
});
