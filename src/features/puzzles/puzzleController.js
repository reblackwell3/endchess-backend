// backend/puzzles/puzzleController.js
const Puzzle = require('./puzzleModel');
const Player = require('../players/playerModel');

// @desc    Get a random puzzle
// @route   GET /api/puzzles/random
// @access  Public
const getRandomPuzzle = async (req, res) => {
  try {
    const count = await Puzzle.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const puzzle = await Puzzle.findOne().skip(randomIndex);
    res.json(puzzle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a random rated game
// @route   GET /api/puzzles/random-rated/:rating
// @access  Public
const getRandomPuzzleRated = async (req, res) => {
  const rating = parseInt(req.params.rating, 10);

  try {
    const count = await Puzzle.countDocuments({
      'Rating': { $gt: rating }
    });
    const randomIndex = Math.floor(Math.random() * count);
    const game = await Puzzle.findOne({
      'Rating': { $gt: rating }
    }).skip(randomIndex);
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get the next puzzle based on elo and player ID
// @route   GET /api/puzzles/next
// @access  Public
const getNextPuzzle = async (req, res) => {
  const { elo, playerId } = req.query;
  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    const puzzlesCompleted = player.puzzlesCompleted;
    const nextPuzzle = await Puzzle.findOne({ Rating: { $lte: elo }, _id: { $nin: puzzlesCompleted } }).sort({ Rating: -1 });
    if (!nextPuzzle) {
      return res.status(404).json({ message: 'No suitable puzzle found' });
    }
    player.puzzlesCompleted.push(nextPuzzle._id);
    await player.save();
    res.json(nextPuzzle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a single puzzle by ID
// @route   GET /api/puzzles/:id
// @access  Public
const getPuzzleById = async (req, res) => {
  try {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found' });
    }
    res.json(puzzle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRandomPuzzle,
  getRandomPuzzleRated,
  getNextPuzzle,
  getPuzzleById,
};
