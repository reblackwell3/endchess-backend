"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/puzzles/puzzleRoutes.js
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { getRandomPuzzle, getRandomPuzzleRated, getNextPuzzle, getPuzzleById, } = require('./puzzleController');
// Get a random puzzle
router.get('/random', getRandomPuzzle);
router.get('/random-rated/:rating', getRandomPuzzleRated);
// Get the next puzzle based on elo and player ID
router.get('/next', getNextPuzzle);
// Get a single puzzle by ID
router.get('/:id', getPuzzleById);
exports.default = router;
