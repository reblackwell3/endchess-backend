import { Document, Model, model, Schema } from 'mongoose';

export interface IGame extends Document {
  ImportFrom?: string;
  GameId: string;
  WhitePlayer: string;
  BlackPlayer: string;
  Result: string;
  Date: string;
  Opening?: string;
  Moves: string;
  PGN: string;
  WhiteElo?: string;
  BlackElo?: string;
  WhiteRatingDiff?: string;
  BlackRatingDiff?: string;
  ECO?: string;
  TimeControl?: string;
  Termination?: string;
}

const gameSchema = new Schema<IGame>({
  ImportFrom: { type: String },
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
  Termination: { type: String },
});

const Game: Model<IGame> = model<IGame>('Game', gameSchema);

export default Game;
