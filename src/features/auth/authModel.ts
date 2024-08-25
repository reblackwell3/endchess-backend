import { Document, model, Schema, Types } from 'mongoose';

export interface IAuth extends Document {
  player: Types.ObjectId;
  provider: string;
  providerId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const authSchema = new Schema<IAuth>({
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  providerId: {
    type: String,
    required: true,
    unique: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

authSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Auth = model<IAuth>('Auth', authSchema);
export default Auth;
