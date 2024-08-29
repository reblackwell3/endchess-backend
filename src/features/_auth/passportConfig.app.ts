import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as AppleStrategy } from 'passport-apple';
import { Strategy as CookieStrategy } from 'passport-cookie';
import User, { IUser } from '../user/userModel'; // Import the User class from the appropriate location
// import dotenv from 'dotenv';
// dotenv.config({ path: '.env' });

// Serialize user into the session
passport.serializeUser((_id: any, done: any) => {
  console.log('Serializing User:', _id);
  done(null, _id);
});

// Deserialize user from the session
passport.deserializeUser(async (_id: string, done: any) => {
  console.log('Deserializing User:', _id);
  try {
    const user = await User.findById(_id).populate('playerId').exec();
    console.log('User:', user);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new CookieStrategy( // the token is undefined here... is this from setting the value in res.cookie?
    {
      cookieName: 'endchess-token',
      signed: false,
      passReqToCallback: false,
    },
    async (token: string, done: any) => {
      console.log('Cookie Token:', token);
      await User.findOne(
        { accessToken: token },
        function (err: Error | null, user: IUser) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        },
      );
    },
  ),
);

export default passport;
