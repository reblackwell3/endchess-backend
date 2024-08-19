// backend/players/playerModel.js
import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  elo: { type: Number, required: true, default: 1200 },
  puzzlesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Puzzle' }],
  gamesCompleted: [{type: mongoose.Schema.Types.ObjectId, ref: 'Game'}]
});

const Player = mongoose.model('Player', playerSchema);

export default Player;
