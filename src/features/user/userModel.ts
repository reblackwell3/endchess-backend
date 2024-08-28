import { Document, model, Schema, Types } from 'mongoose';

export interface IUser extends Document {
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

const userSchema = new Schema<IUser>(
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
    },
    givenName: {
      type: String,
    },
    familyName: {
      type: String,
    },
  },
  { timestamps: true },
);

const User = model<IUser>('User', userSchema);
export default User;
