"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomGameRated = exports.getGameById = exports.getRandomGame = void 0;
const gameModel_1 = __importDefault(require("./gameModel"));
// @desc    Get a random game
// @route   GET /api/games/random
// @access  Public
const getRandomGame = async (req, res) => {
    try {
        const count = await gameModel_1.default.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const game = await gameModel_1.default.findOne().skip(randomIndex);
        res.json(game);
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
};
exports.getRandomGame = getRandomGame;
// @desc    Get a random rated game
// @route   GET /api/games/random-rated/:rating
// @access  Public
const getRandomGameRated = async (req, res) => {
    const rating = parseInt(req.params.rating, 10);
    try {
        const count = await gameModel_1.default.countDocuments({
            'WhiteElo': { $gt: rating },
            'BlackElo': { $gt: rating }
        });
        const randomIndex = Math.floor(Math.random() * count);
        const game = await gameModel_1.default.findOne({
            'WhiteElo': { $gt: rating },
            'BlackElo': { $gt: rating }
        }).skip(randomIndex);
        res.json(game);
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
};
exports.getRandomGameRated = getRandomGameRated;
// @desc    Get a game by ID
// @route   GET /api/games/:id
// @access  Public
const getGameById = async (req, res) => {
    try {
        const game = await gameModel_1.default.findById(req.params.id);
        if (!game) {
            res.status(404).json({ message: 'Game not found' });
        }
        else {
            res.json(game);
        }
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
};
exports.getGameById = getGameById;
