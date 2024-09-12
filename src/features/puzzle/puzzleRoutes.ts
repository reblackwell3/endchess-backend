// backend/puzzles/puzzleRoutes.ts
import express, { Request, Response } from 'express';
import controller from './puzzleController';

const router = express.Router();

// Get a random puzzle
router.get('/', controller.getPuzzle);

export default router;
