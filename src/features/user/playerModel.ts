import mongoose, { Document, Model, Types } from 'mongoose';

// Define the IPlayerDocument interface
export interface IPlayerDocument extends Document {
  elo: number;
  puzzlesCompleted: Types.ObjectId[];
  importedGames: Types.ObjectId[];
  gamesCompleted: Types.ObjectId[];
  unimportedLinks: number;
}

// Define the IPlayer interface extending IPlayerDocument
export interface IPlayer extends IPlayerDocument {}

// Define the IPlayerModel interface
export interface IPlayerModel extends Model<IPlayer> {
  findOrCreate(providerId: string): Promise<Types.ObjectId>;
}

// Define the player schema
export const playerSchema = new mongoose.Schema<IPlayer>({
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
  unimportedLinks: {
    type: Number,
    default: 0,
  },
});

// Create the Player model
const Player = mongoose.model<IPlayer, IPlayerModel>('Player', playerSchema);

export default Player;
