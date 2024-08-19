"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCompletedGame = exports.addCompletedPuzzle = exports.updatePlayerElo = exports.getPlayerByUserId = exports.createPlayer = void 0;
const playerModel_1 = __importDefault(require("./playerModel"));
// @desc    Create a new player
// @route   POST /api/players
// @access  Public
const createPlayer = async (req, res) => {
    const { userId, elo } = req.body;
    const player = new playerModel_1.default({
        userId,
        elo: elo || 1200,
        puzzlesCompleted: [],
    });
    try {
        const newPlayer = await player.save();
        res.status(201).json(newPlayer);
    }
    catch (err) {
        const error = err;
        res.status(400).json({ message: error.message });
    }
};
exports.createPlayer = createPlayer;
// @desc    Get a single player by userId
// @route   GET /api/players/:userId
// @access  Public
const getPlayerByUserId = async (req, res) => {
    try {
        const player = await playerModel_1.default.findOne({ userId: req.params.userId });
        if (!player) {
            res.status(404).json({ message: 'Player not found' });
        }
        else {
            res.json(player);
        }
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
};
exports.getPlayerByUserId = getPlayerByUserId;
// @desc    Update a player's ELO
// @route   PUT /api/players/:userId/elo
// @access  Public
const updatePlayerElo = async (req, res) => {
    try {
        const player = await playerModel_1.default.findOne({ userId: req.params.userId });
        if (!player) {
            res.status(404).json({ message: 'Player not found' });
        }
        else {
            // Update player's ELO
            player.elo = req.body.elo;
            const updatedPlayer = await player.save();
            res.json(updatedPlayer);
        }
    }
    catch (err) {
        const error = err;
        res.status(400).json({ message: error.message });
    }
};
exports.updatePlayerElo = updatePlayerElo;
// @desc    Add a completed puzzle to a player
// @route   PUT /api/players/:userId/completed
// @access  Public
const addCompletedPuzzle = async (req, res) => {
    try {
        console.log(req.body);
        const player = await playerModel_1.default.findOne({ userId: req.params.userId });
        console.log(player);
        const puzzleId = req.body.puzzleId;
        console.log(puzzleId);
        if (!player) {
            res.status(404).json({ message: 'Player not found' });
        }
        else {
            // Add puzzle to the completed puzzles list
            player.puzzlesCompleted.push(puzzleId);
            const updatedPlayer = await player.save();
            res.json(updatedPlayer);
        }
    }
    catch (err) {
        const error = err;
        res.status(400).json({ message: error.message });
    }
};
exports.addCompletedPuzzle = addCompletedPuzzle;
// @desc    Add a completed game to a player
// @route   PUT /api/players/:userId/completed-game
// @access  Public
const addCompletedGame = async (req, res) => {
    try {
        console.log(req.body);
        const player = await playerModel_1.default.findOne({ userId: req.params.userId });
        console.log(player);
        const gameId = req.body.gameId;
        console.log(gameId);
        if (!player) {
            res.status(404).json({ message: 'Player not found' });
        }
        else {
            // Add game to the completed games list
            player.gamesCompleted.push(gameId);
            const updatedPlayer = await player.save();
            res.json(updatedPlayer);
        }
    }
    catch (err) {
        const error = err;
        res.status(400).json({ message: error.message });
    }
};
exports.addCompletedGame = addCompletedGame;
// // @desc    Delete a player
// // @route   DELETE /api/players/:userId
// // @access  Public
// export const deletePlayer = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const player = await Player.findOne({ userId: req.params.userId });
//     if (!player) {
//       res.status(404).json({ message: 'Player not found' });
//     } else {
//           await player.remove();
//           res.json({ message: 'Player deleted' });
//     }
//   } catch (err) {
//     const error = err as Error;
//     res.status(500).json({ message: error.message });
//   }
// };
