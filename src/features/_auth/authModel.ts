import { Document, model, Schema, Types } from 'mongoose';

export interface IAuth extends Document {
  playerId: Types.ObjectId;
  provider: string;
  providerId: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  emailVerified: boolean;
  name: string;
  picture: string;
  givenName: string;
  familyName: string;
  createdAt: Date;
  updatedAt: Date;
}

const authSchema = new Schema<IAuth>(
  {
    playerId: {
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
    email: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    givenName: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Auth = model<IAuth>('Auth', authSchema);
export default Auth;
