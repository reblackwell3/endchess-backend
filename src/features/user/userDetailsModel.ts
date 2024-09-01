import { Schema, Document, model } from 'mongoose';

export interface IUserDetails extends Document {
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
}

export const userDetailsSchema = new Schema<IUserDetails>(
  {
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
      required: false,
    },
    givenName: {
      type: String,
      required: false,
    },
    familyName: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const UserDetails = model<IUserDetails>('UserDetails', userDetailsSchema);
export default UserDetails;
