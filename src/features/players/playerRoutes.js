// backend/players/playerRoutes.js
const express = require('express');
const router = express.Router();
const {
  createPlayer,
  getPlayerByUserId,
  updatePlayerElo,
  addCompletedPuzzle,
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

// Delete a player
router.delete('/:userId', deletePlayer);

module.exports = router;
