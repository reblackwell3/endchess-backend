import { Document, model, Schema, Types, Model } from 'mongoose';
import UserDetails, {
  IUserDetails,
  userDetailsSchema,
} from './userDetailsModel';
import Player, { playerSchema, IPlayer } from './playerModel';

export interface IUserDocument extends Document {
  playerId: Types.ObjectId;
  userDetails: IUserDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends IUserDocument {
  player: IPlayer;
  userDetails: IUserDetails;
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
    player: {
      type: playerSchema,
      required: true,
    },
    userDetails: {
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
  let user = await this.findOne({ 'userDetails.providerId': profile.id });
  if (!user) {
    const userDetails = new UserDetails({
      provider: profile.provider,
      providerId: profile.id,
      accessToken,
      refreshToken,
      email: profile.emails[0].value,
      emailVerified: true, // Assuming email is verified
      name: profile.displayName,
      givenName: profile.name.givenName,
      familyName: profile.name.familyName,
      picture: profile.photos[0].value,
    });

    const player = new Player({});

    user = await this.create({
      player,
      userDetails,
    });
  }
  return user;
};

const User = model<IUser, IUserModel>('User', userSchema);

export default User;
