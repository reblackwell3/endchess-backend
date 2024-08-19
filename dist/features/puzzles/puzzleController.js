"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPuzzleById = exports.getNextPuzzle = exports.getRandomPuzzleRated = exports.getRandomPuzzle = void 0;
const puzzleModel_1 = __importDefault(require("./puzzleModel"));
const playerModel_1 = __importDefault(require("../players/playerModel"));
// @desc    Get a random puzzle
// @route   GET /api/puzzles/random
// @access  Public
const getRandomPuzzle = async (req, res) => {
    try {
        const count = await puzzleModel_1.default.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const puzzle = await puzzleModel_1.default.findOne().skip(randomIndex);
        if (puzzle) {
            res.json(puzzle);
        }
        else {
            res.status(404).json({ message: 'Puzzle not found' });
        }
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
};
exports.getRandomPuzzle = getRandomPuzzle;
// @desc    Get a random rated puzzle
// @route   GET /api/puzzles/random-rated/:rating
// @access  Public
const getRandomPuzzleRated = async (req, res) => {
    const rating = parseInt(req.params.rating, 10);
    try {
        const count = await puzzleModel_1.default.countDocuments({ 'Rating': { $gt: rating } });
        const randomIndex = Math.floor(Math.random() * count);
        const puzzle = await puzzleModel_1.default.findOne({ 'Rating': { $gt: rating } }).skip(randomIndex);
        if (puzzle) {
            res.json(puzzle);
        }
        else {
            res.status(404).json({ message: 'Puzzle not found' });
        }
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
};
exports.getRandomPuzzleRated = getRandomPuzzleRated;
// @desc    Get the next puzzle based on elo and player ID
// @route   GET /api/puzzles/next
// @access  Public
const getNextPuzzle = async (req, res) => {
    const { elo, playerId } = req.query;
    try {
        const player = await playerModel_1.default.findById(playerId);
        if (player) {
            const puzzlesCompleted = player.puzzlesCompleted;
            const nextPuzzle = await puzzleModel_1.default.findOne({
                Rating: { $lte: elo },
                _id: { $nin: puzzlesCompleted },
            }).sort({ Rating: -1 });
            if (nextPuzzle) {
                player.puzzlesCompleted.push(nextPuzzle._id);
                await player.save();
                res.json(nextPuzzle);
            }
            else {
                res.status(404).json({ message: 'No suitable puzzle found' });
            }
        }
        else {
            res.status(404).json({ message: 'Player not found' });
        }
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
};
exports.getNextPuzzle = getNextPuzzle;
// @desc    Get a single puzzle by ID
// @route   GET /api/puzzles/:id
// @access  Public
const getPuzzleById = async (req, res) => {
    try {
        const puzzle = await puzzleModel_1.default.findById(req.params.id);
        if (puzzle) {
            res.json(puzzle);
        }
        else {
            res.status(404).json({ message: 'Puzzle not found' });
        }
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
};
exports.getPuzzleById = getPuzzleById;
