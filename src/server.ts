// backend/server.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express, { Request } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import puzzleRoutes from './features/puzzles/puzzleRoutes';
import gameRoutes from './features/games/gameRoutes';
import mistakesRoutes from './features/mistakes/mistakesRoutes';
import authenticateCookie from './features/auth/authenticateCookie';
import authRoutes from './features/auth/authRoutes';
import passport from 'passport';
import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
// import cookieSignature from 'cookie-signature';
// import User from './features/user/userModel';

const app = express();
const corsOptions = {
  origin: process.env.REACT_APP_URL!, // Your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors<Request>(corsOptions));

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

app.use(cookieParser(process.env.COOKIE_SECRET!));

app.use(passport.initialize());
app.use(passport.session());
require('./features/auth/passportConfig')(passport);

app.use(express.json());

app.use('/auth', authRoutes);

app.use(authenticateCookie);

app.use('/puzzles', puzzleRoutes);
app.use('/games', gameRoutes);
app.use('/mistakes', mistakesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
