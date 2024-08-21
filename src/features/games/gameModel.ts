import { Document, Model, model, Schema } from 'mongoose';

export interface IGame extends Document {
  importFrom: string; // 'chess.com' or 'lichess'
  url: string;
  pgn: string;
  timeControl: string;
  endTime: Date;
  rated: boolean;
  tcn?: string;
  uuid: string;
  initialSetup: string;
  fen: string;
  timeClass: string;
  rules: string;
  eco?: string;
  ecoUrl?: string;
  termination: string;
  white: {
    rating: number;
    result: string;
    id: string;
    username: string;
    uuid: string;
  };
  black: {
    rating: number;
    result: string;
    id: string;
    username: string;
    uuid: string;
  };
}

const gameSchema = new Schema<IGame>({
  importFrom: { type: String, required: true },
  url: { type: String, required: true },
  pgn: { type: String, required: true },
  timeControl: { type: String, required: true },
  endTime: { type: Date, required: true },
  rated: { type: Boolean, required: true },
  tcn: { type: String },
  uuid: { type: String, required: true },
  initialSetup: { type: String, required: true },
  fen: { type: String, required: true },
  timeClass: { type: String, required: true },
  rules: { type: String, required: true },
  eco: { type: String },
  ecoUrl: { type: String },
  termination: { type: String, required: true },
  white: {
    rating: { type: Number, required: true },
    result: { type: String, required: true },
    id: { type: String, required: true },
    username: { type: String, required: true },
    uuid: { type: String, required: true },
  },
  black: {
    rating: { type: Number, required: true },
    result: { type: String, required: true },
    id: { type: String, required: true },
    username: { type: String, required: true },
    uuid: { type: String, required: true },
  },
});

const Game: Model<IGame> = model<IGame>('Game', gameSchema);

export default Game;
