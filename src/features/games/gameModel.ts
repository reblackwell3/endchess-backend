import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  ImportFrom: {type: String},
  GameId: { type: String, required: true },
  WhitePlayer: { type: String, required: true },
  BlackPlayer: { type: String, required: true },
  Result: { type: String, required: true },
  Date: { type: String, required: true },
  Opening: { type: String },
  Moves: { type: String, required: true },
  PGN: { type: String, required: true },
  WhiteElo: { type: String },
  BlackElo: { type: String },
  WhiteRatingDiff: { type: String },
  BlackRatingDiff: { type: String },
  ECO: { type: String },
  TimeControl: { type: String },
  Termination: { type: String }
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
