// backend/server.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express, { Request } from 'express';
import cors from 'cors';
import authRoutes from './features/_auth/authRoutes';
import passport from 'passport';
import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import cookieParser from 'cookie-parser'; // Import the cookie-parser module
import connectDB from './config/db';

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

app.use(cookieParser(process.env.COOKIE_SECRET)); // Use the cookie-parser middleware

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/', authRoutes);

const PORT = process.env.AUTH_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
