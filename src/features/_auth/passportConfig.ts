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
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id: string, done: any) => {
  console.log('Deserializing User:', id);
  done(null, User.findById(id).populate('players'));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/google/callback',
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any,
    ) => {
      try {
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
        await User.findOrCreate(profile, accessToken, refreshToken);
        done(null, profile);
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.use(
  // 'cookie',
  new CookieStrategy( // the token is undefined here... is this from setting the value in res.cookie?
    {
      cookieName: 'myapp-userid',
      signed: false,
      passReqToCallback: false,
    },
    (token: string, done: any) => {
      console.log('Cookie Token:', token);
      User.findOne(
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

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: '/auth/facebook/callback',
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // Handle user data here
//       done(null, profile);
//     },
//   ),
// );

// passport.use(
//   new AppleStrategy(
//     {
//       clientID: process.env.APPLE_CLIENT_ID,
//       teamID: process.env.APPLE_TEAM_ID,
//       keyID: process.env.APPLE_KEY_ID,
//       privateKeyString: process.env.APPLE_PRIVATE_KEY,
//       callbackURL: '/auth/apple/callback',
//     },
//     (accessToken, refreshToken, idToken, profile, done) => {
//       // Handle user data here
//       done(null, profile);
//     },
//   ),
// );

export default passport;
