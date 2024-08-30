// backend/server.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import express from 'express';
import connectDB from '../../src/config/db';
import puzzleRoutes from '../../src/features/puzzles/puzzleRoutes';
import gameRoutes from '../../src/features/games/gameRoutes';
// import { attachPlayerId } from '../../src/features/_middleware/addPlayerIdMiddleware';
import { authenticateCookie } from '../../src/features/auth/authenticateCookie';
// import { createOrUpdateAuth } from '../../src/features/_middleware/createOrUpdateAuth';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import User, { IUser } from '../../src/features/user/userModel';
import Player from '../../src/features/user/playerModel';
import UserDetails from '../../src/features/user/userDetailsModel';
import cookieSignature from 'cookie-signature';
import request from 'supertest';

const app = express();

connectDB();

const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI!,
  collection: 'sessions',
});

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  }),
);

app.use(cookieParser(process.env.COOKIE_SECRET!)); // Use the cookie-parser middleware

app.use(passport.initialize());
app.use(passport.session());

app.use(authenticateCookie);

app.use('/puzzles', puzzleRoutes);

app.use('/games', gameRoutes);

dotenv.config({ path: '.env.test' });

function buildUser(): IUser {
  const details = new UserDetails({
    email: 'dummy@example.com',
    emailVerified: true,
    name: 'Dummy User',
    givenName: 'Dummy',
    familyName: 'User',
    picture: 'http://example.com/dummy.jpg',
  });

  const player = new Player({});

  const user = new User({
    provider: 'dummyProvider',
    providerId: 'dummyId',
    accessToken: 'dummyAccessToken',
    refreshToken: 'dummyRefreshToken',
    player,
    details,
  });

  return user;
}
describe('Cookie API Calls Integration Tests', () => {
  let signedCookie: string;
  beforeAll(async () => {
    await User.deleteMany({ providerId: 'dummyId' }); // Clear the User collection before tests
    const user = buildUser();
    User.create(user);
    signedCookie = `s:${cookieSignature.sign(user.accessToken, process.env.COOKIE_SECRET!)}`;
  });

  it('should be able to get a random puzzle', async () => {
    const res = await request(app)
      .get('/puzzles/random')
      .set('Cookie', `endchess-token=${signedCookie}`);

    expect(res.status).toBe(200);
  });

  // Add tests for your GET endpoints here
  it('should be able to get a random game', async () => {
    const res = await request(app)
      .get('/games/random')
      .set('Cookie', `endchess-token=${signedCookie}`);

    expect(res.status).toBe(200);
    // Add more assertions based on the expected response
  });
});
