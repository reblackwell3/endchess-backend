"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/players/playerRoutes.js
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { createPlayer, getPlayerByUserId, updatePlayerElo, addCompletedPuzzle, addCompletedGame, deletePlayer, } = require('./playerController');
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
exports.default = router;
