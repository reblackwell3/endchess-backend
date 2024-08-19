// backend/players/playerRoutes.js
import express from 'express';
const router = express.Router();
const {
  createPlayer,
  getPlayerByUserId,
  updatePlayerElo,
  addCompletedPuzzle,
  addCompletedGame,
  deletePlayer,
} = require('./playerController');

// Create a new player
router.post('/', createPlayer);

// Get a single player by ID
router.get('/:userId', getPlayerByUserId);

// Update a player's ELO
router.put('/:userId/elo', updatePlayerElo);

// Add a completed puzzle to a player
router.put('/:userId/completed', addCompletedPuzzle);

// Add a completed puzzle to a player
router.put('/:userId/completed-game', addCompletedGame);

// Delete a player
router.delete('/:userId', deletePlayer);

export default router;
