// backend/games/gameController.js
const Game = require('./gameModel');

// @desc    Get a random game
// @route   GET /api/games/random
// @access  Public
const getRandomGame = async (req, res) => {
  try {
    const count = await Game.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const game = await Game.findOne().skip(randomIndex);
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc    Get a random rated game
// @route   GET /api/games/random-rated/:rating
// @access  Public
const getRandomGameRated = async (req, res) => {
  const rating = parseInt(req.params.rating, 10);

  try {
    const count = await Game.countDocuments({
      'WhiteElo': { $gt: rating },
      'BlackElo': { $gt: rating }
    });
    const randomIndex = Math.floor(Math.random() * count);
    const game = await Game.findOne({
      'WhiteElo': { $gt: rating },
      'BlackElo': { $gt: rating }
    }).skip(randomIndex);
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a game by ID
// @route   GET /api/games/:id
// @access  Public
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRandomGame,
  getGameById,
  getRandomGameRated
};
