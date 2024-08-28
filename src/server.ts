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
import authRoutes from './features/_auth/authRoutes';
import { attachPlayerId } from './features/_middleware/addPlayerIdMiddleware';
import { authenticateCookie } from './features/_middleware/authenticateCookie';
import { createOrUpdateAuth } from './features/_middleware/createOrUpdateAuth';
import passport = require('passport');
import session = require('express-session');
import cookieParser from 'cookie-parser'; // Import the cookie-parser module

const app = express();
app.use(cors<Request>());

connectDB();

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(cookieParser()); // Use the cookie-parser middleware

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/auth', authRoutes);

app.use(authenticateCookie);

app.use(createOrUpdateAuth);

app.use(attachPlayerId);

app.use('/puzzles', puzzleRoutes);

app.use('/players', playerRoutes);

app.use('/games', gameRoutes);

app.use('/import', importRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
