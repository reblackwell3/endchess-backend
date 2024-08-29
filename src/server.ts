// backend/server.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express, { NextFunction, Request } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import puzzleRoutes from './features/puzzles/puzzleRoutes';
import playerRoutes from './features/players/playerRoutes';
import gameRoutes from './features/games/gameRoutes';
import importRoutes from './features/import/importRoutes';
// import { attachPlayerId } from './features/_middleware/addPlayerIdMiddleware';
import { authenticateCookie } from './features/_middleware/authenticateCookie';
// import { createOrUpdateAuth } from './features/_middleware/createOrUpdateAuth';
import passport from 'passport';
import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors<Request>());

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

// todo make sure that all of this functionality is replaced by sessions

app.use(authenticateCookie);
// app.use(createOrUpdateAuth);
// app.use(attachPlayerId);

app.use('/puzzles', puzzleRoutes);

app.use('/players', playerRoutes);

app.use('/games', gameRoutes);

app.use('/import', importRoutes);

const PORT = process.env.APP_PORT || 5555;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
