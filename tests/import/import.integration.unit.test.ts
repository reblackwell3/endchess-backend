import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request, { Response as SupertestResponse } from 'supertest';
import express from 'express';
import importRoutes from '../../src/features/import/importRoutes';
import { connectDB, closeDB } from '../../src/config/db';
import Game from '../../src/features/games/gameModel';
import User from '../../src/features/user/userModel';
import mockDetails from '../__mocks__/mockFindOrCreateUserDetails';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import authenticateCookie from '../../src/features/auth/authenticateCookie';
import connectMongoDBSession from 'connect-mongodb-session';
import cookieSignature from 'cookie-signature';

const app = express();
app.use(express.json());
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

app.use('/import', importRoutes);

describe('Import Controller', () => {
  const chesscom_username = 'minhnotminh';
  const chesscom_games_count = 16;
  const lichess_username = 'Minhnotminh';
  const lichess_games_count = 1;
  let signedCookie: string;

  beforeAll(async () => {
    await User.deleteOne({ providerId: mockDetails.profile.id });
    await User.findOrCreate(
      mockDetails.profile,
      mockDetails.accessToken,
      mockDetails.refreshToken,
    );
    await Game.deleteMany({
      $or: [
        { 'white.username': chesscom_username },
        { 'black.username': chesscom_username },
        { 'white.username': lichess_username },
        { 'black.username': lichess_username },
      ],
    });
    signedCookie = `s:${cookieSignature.sign(mockDetails.accessToken, process.env.COOKIE_SECRET!)}`;
  });

  beforeEach(async () => {
    await User.findOneAndUpdate(
      // Clear the User collection before tests
      { providerId: mockDetails.profile.id },
      { $set: { 'player.importedGames': [] } },
    );
  });

  afterAll(async () => {
    closeDB();
  });

  it('should import games, and verify the data', async () => {
    const chesscomRes = await request(app)
      .post('/import')
      .send({
        otherPlatform: 'chesscom',
        otherUsername: chesscom_username,
      })
      .set('Cookie', `endchess-token=${signedCookie}`);

    await expectCountEquals(
      chesscomRes,
      chesscom_games_count,
      'Chess.com games imported successfully',
    );
  });

  it('should import games from lichess and verify', async () => {
    const lichessRes = await request(app)
      .post('/import')
      .send({
        otherPlatform: 'lichess',
        otherUsername: lichess_username,
      })
      .set('Cookie', `endchess-token=${signedCookie}`);
    await expectCountEquals(
      lichessRes,
      lichess_games_count,
      'Lichess games imported successfully',
    );
  });

  async function expectCountEquals(
    res: SupertestResponse,
    count: number,
    successMessage: string,
  ) {
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(successMessage);
    expect(res.body.feedback.inserts.length).toBeGreaterThanOrEqual(count);
    const user = await User.findOne({
      providerId: mockDetails.profile.id,
    }).populate('player');
    const importedGames = user!.player.importedGames;
    expect(importedGames.length).toBeGreaterThanOrEqual(count);

    const gamesInDB = await Game.find({
      _id: { $in: importedGames },
    });
    expect(gamesInDB.length).toBe(count);
  }
});
