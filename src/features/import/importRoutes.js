const express = require('express');
const router = express.Router();
const { importChesscomGames, importLichessGames } = require('./importController');

// Route to import games from Chess.com by username
router.get('/chesscom/:username', importChesscomGames);

// Route to import games from Lichess by username
router.get('/lichess/:username', importLichessGames);

module.exports = router;
