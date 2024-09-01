import { Document, model, Schema, Types, Model } from 'mongoose';
import UserDetails, {
  IUserDetails,
  userDetailsSchema,
} from './userDetailsModel';
import Player, { playerSchema, IPlayer } from './playerModel';

export interface IUserDocument extends Document {
  player: IPlayer;
  details: IUserDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends IUserDocument {
  provider: string;
  providerId: string;
  accessToken: string;
  refreshToken: string;
  player: IPlayer;
  details: IUserDetails;
}

export interface IUserModel extends Model<IUser> {
  findOrCreate: (
    profile: {
      id: string;
      provider: string;
      emails: { value: string }[];
      displayName: string;
      name: { givenName: string; familyName: string };
      photos: { value: string }[];
    },
    accessToken: string,
    refreshToken: string,
  ) => Promise<IUser>;
}

const userSchema = new Schema<IUser>(
  {
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
      required: false,
    },
    player: {
      type: playerSchema,
      required: true,
    },
    details: {
      type: userDetailsSchema,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.statics.findOrCreate = async function (
  profile: {
    id: string;
    provider: string;
    emails: { value: string }[];
    displayName: string;
    name: { givenName: string; familyName: string };
    photos: { value: string }[];
  },
  accessToken: string,
  refreshToken: string,
) {
  let user = await this.findOne({
    providerId: profile.id,
  });
  if (!user) {
    const details = new UserDetails({
      email: profile.emails[0].value,
      emailVerified: true, // Assuming email is verified
      name: profile.displayName,
      givenName: profile.name.givenName,
      familyName: profile.name.familyName,
      picture: profile.photos[0].value,
    });

    const player = new Player({});

    user = await this.create({
      provider: profile.provider,
      providerId: profile.id,
      accessToken,
      refreshToken,
      player,
      details,
    });
  }
  return user;
};

const User = model<IUser, IUserModel>('User', userSchema);

export default User;
