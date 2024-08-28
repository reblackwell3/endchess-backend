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

const app = express();
app.use(cors<Request>());

const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI!,
  collection: 'session',
});

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);

app.use(cookieParser()); // Use the cookie-parser middleware

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/', authRoutes);

const PORT = process.env.AUTH_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
