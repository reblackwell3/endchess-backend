// backend/puzzles/puzzleModel.js
const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
  PuzzleId: String,
  FEN: String,
  Moves: String,
  Rating: Number,
  RatingDeviation: Number,
  Popularity: Number,
  NbPlays: Number,
  Themes: String,
  GameUrl: String,
  OpeningTags: String,
});

const Puzzle = mongoose.model('Puzzle', puzzleSchema);

module.exports = Puzzle;
