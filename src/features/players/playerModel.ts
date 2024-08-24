import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  elo: {
    type: Number,
    default: 1200,
  },
  puzzlesCompleted: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  importedGames: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [], // Ensure the array is initialized
  },
  gamesCompleted: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [], // Initialize this array too
  },
});

const Player = mongoose.model('Player', playerSchema);
export default Player;
