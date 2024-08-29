import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as AppleStrategy } from 'passport-apple';
import { Strategy as CookieStrategy } from 'passport-cookie';
import User, { IUser } from '../user/userModel'; // Import the User class from the appropriate location
// import dotenv from 'dotenv';
// dotenv.config({ path: '.env' });

// Serialize user into the session
passport.serializeUser((user: any, done: any) => {
  console.log('Serializing User:', user);
  done(null, user._id); // todo there is no .id but can get ._id
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done: any) => {
  console.log('Deserializing User:', id);
  try {
    const user = await User.findById(id);
    console.log('Found User in deserializing:', user);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new CookieStrategy( // the token is undefined here... is this from setting the value in res.cookie?
    {
      cookieName: 'endchess-token',
      signed: true,
      passReqToCallback: false,
    },
    async (token: string, done: any) => {
      console.log('Cookie Token:', token);
      try {
        const user = await User.findOne({ accessToken: token });
        if (!user) return done(null, false);
        console.log('Cookie Strategy found user: ', user);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
