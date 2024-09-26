import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express, { Request } from 'express';
import cors from 'cors';
import puzzleRoutes from './features/puzzle/puzzleRoutes';
import mistakesRoutes from './features/mistake/mistakesRoutes';
import authenticateCookie from './auth/authenticateCookie';
import authRoutes from './auth/authRoutes';
import passport from 'passport';
import session from './config/session';

import cookieParser from 'cookie-parser';

const app = express();
const corsOptions = {
  origin: process.env.REACT_APP_URL!,
  credentials: true,
};

app.use(cors<Request>(corsOptions));

app.use(session);

app.use(cookieParser(process.env.COOKIE_SECRET!));

app.use(passport.initialize());
app.use(passport.session());
require('./features/auth/passportConfig')(passport);

app.use(express.json());

app.use('/auth', authRoutes);

app.use(authenticateCookie);

app.use('/puzzles', puzzleRoutes);
app.use('/mistakes', mistakesRoutes);

export default app;
