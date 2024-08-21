import { Document, Model, model, Schema } from 'mongoose';

export interface IGame extends Document {
  import_from: string; // 'chess.com' or 'lichess'
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  tcn?: string;
  uuid: string;
  initial_setup: string;
  fen: string;
  time_class: string;
  rules: string;
  eco?: string;
  eco_url?: string;
  termination: string;
  white: {
    rating: number;
    result: string;
    username: string;
  };
  black: {
    rating: number;
    result: string;
    username: string;
  };
  result: string;
}

const gameSchema = new Schema<IGame>({
  import_from: { type: String, required: true },
  url: { type: String, required: true },
  pgn: { type: String, required: true },
  time_control: { type: String, required: true },
  end_time: { type: Number, required: true },
  rated: { type: Boolean, required: true },
  tcn: { type: String },
  uuid: { type: String, required: true },
  initial_setup: { type: String, required: true },
  fen: { type: String, required: true },
  time_class: { type: String, required: true },
  rules: { type: String, required: true },
  eco: { type: String },
  white: {
    rating: { type: Number, required: true },
    result: { type: String, required: true },
    username: { type: String, required: true },
  },
  black: {
    rating: { type: Number, required: true },
    result: { type: String, required: true },
    username: { type: String, required: true },
  },
  result: { type: String },
});

const Game: Model<IGame> = model<IGame>('Game', gameSchema);

export default Game;
