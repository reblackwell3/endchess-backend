// backend/players/playerRoutes.ts
import express, { Request, Response } from 'express';
import {
  createPlayer,
  getPlayerByUserId,
  updatePlayerElo,
  addCompletedPuzzle,
  addCompletedGame,
  // deletePlayer,
} from './playerController.js';

const router = express.Router();

// Create a new player
router.post('/', (req: Request, res: Response) => {
  createPlayer(req, res);
});

// Get a single player by ID
router.get('/:userId', (req: Request, res: Response) => {
  getPlayerByUserId(req, res);
});

// Update a player's ELO
router.put('/:userId/elo', (req: Request, res: Response) => {
  updatePlayerElo(req, res);
});

// Add a completed puzzle to a player
router.put('/:userId/completed', (req: Request, res: Response) => {
  addCompletedPuzzle(req, res);
});

// Add a completed game to a player
router.put('/:userId/completed-game', (req: Request, res: Response) => {
  addCompletedGame(req, res);
});

// // Delete a player
// router.delete('/:userId', (req: Request, res: Response) => {
//   deletePlayer(req, res);
// });

export default router;
