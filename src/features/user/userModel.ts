import { Document, model, Schema, Types, Model } from 'mongoose';

// EXAMPLE SETUP FROM:
// https://stackoverflow.com/questions/42448372/typescript-mongoose-static-model-method-property-does-not-exist-on-type

export interface IUserDocument extends Document {
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

export interface IUser extends IUserDocument {
  // EXAMPLE LINKED BELOW
  // comparePassword: (password: string) => boolean;
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
  findByAccessToken: (
    token: { token: string },
    callback: (err: Error | null, user: IUser) => any,
  ) => Promise<IUser | null>;
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

//EXAMPLE LINKED TO IUser
// userSchema.method('comparePassword', function (password: string): boolean {
//   if (bcrypt.compareSync(password, this.password)) return true;
//   return false;
// });

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
  let user = await this.findOne({ providerId: profile.id });
  if (!user) {
    user = await this.create({
      playerId: new Types.ObjectId(), // You might want to adjust this based on your logic
      provider: profile.provider,
      providerId: profile.id,
      accessToken,
      refreshToken,
      email: profile.emails[0].value,
      emailVerified: true, // Adjust this based on your logic
      name: profile.displayName,
      picture: profile.photos[0].value,
      givenName: profile.name.givenName,
      familyName: profile.name.familyName,
    });
  }
  return user;
};

const User = model<IUser, IUserModel>('User', userSchema);
export default User;
