import express from 'express';
const router = express.Router();
const {
  getRandomGame,
  getRandomGameRated,
  getGameById,
} = require('./gameController');

router.get('/random', getRandomGame);
router.get('/random-rated/:rating', getRandomGameRated);
router.get('/:id', getGameById);

export default router;
