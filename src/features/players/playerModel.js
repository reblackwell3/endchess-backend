// backend/players/playerModel.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  elo: { type: Number, required: true, default: 1200 },
  puzzlesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Puzzle' }],
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
