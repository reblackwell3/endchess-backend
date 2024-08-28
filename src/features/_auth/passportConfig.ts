import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as AppleStrategy } from 'passport-apple';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any,
    ) => {
      try {
        // Handle user data here
        // Access and use the access token and refresh token as needed
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        // Your code here to handle the tokens

        done(null, profile);
      } catch (error) {
        done(error);
      }
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
