const express = require('express');
const router = express.Router();
const {
  getRandomGame,
  getRandomGameRated,
  getGameById,
} = require('./gameController');

router.get('/random', getRandomGame);
router.get('/random-rated/:rating', getRandomGameRated);
router.get('/:id', getGameById);

module.exports = router;
