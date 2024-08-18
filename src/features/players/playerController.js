// backend/players/playerController.js
const Player = require('./playerModel');

// @desc    Create a new player
// @route   POST /api/players
// @access  Public
const createPlayer = async (req, res) => {
  const { userId, elo } = req.body;

  const player = new Player({
    userId,
    elo: elo || 1200,
    puzzlesCompleted: [],
  });

  try {
    const newPlayer = await player.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get a single player by userId
// @route   GET /api/players/:userId
// @access  Public
const getPlayerByUserId = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.params.userId });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a player's ELO
// @route   PUT /api/players/:userId/elo
// @access  Public
const updatePlayerElo = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.params.userId });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Update player's ELO
    player.elo = req.body.elo;

    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Add a completed puzzle to a player
// @route   PUT /api/players/:userId/completed
// @access  Public
const addCompletedPuzzle = async (req, res) => {
  try {
    console.log(req.body);
    const player = await Player.findOne({ userId: req.params.userId });
    console.log(player);
    const puzzleId = req.body.puzzleId;
    console.log(puzzleId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Add puzzle to the completed puzzles list
    player.puzzlesCompleted.push(puzzleId);

    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Add a completed puzzle to a player
// @route   PUT /api/players/:userId/completed-game
// @access  Public
const addCompletedGame = async (req, res) => {
  try {
    console.log(req.body);
    const player = await Player.findOne({ userId: req.params.userId });
    console.log(player);
    const gameId = req.body.gameId;
    console.log(gameId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Add puzzle to the completed puzzles list
    player.gamesCompleted.push(gameId);

    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a player
// @route   DELETE /api/players/:userId
// @access  Public
const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.params.userId });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    await player.remove();
    res.json({ message: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPlayer,
  getPlayerByUserId,
  updatePlayerElo,
  addCompletedPuzzle,
  addCompletedGame,
  deletePlayer,
};
