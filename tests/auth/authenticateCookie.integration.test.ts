import request from 'supertest';
import express, { Request, Response } from 'express';
import { authenticateCookie } from '../../src/features/auth/authenticateCookie';
import User, { IUser } from '../../src/features/user/userModel';
import UserDetails from '../../src/features/user/userDetailsModel';
import Player from '../../src/features/user/playerModel';
import cookieSignature from 'cookie-signature';
import dotenv from 'dotenv';
import connectDB from '../../src/config/db';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

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

app.post(
  '/test-authenticate-cookie-middleware-only',
  authenticateCookie,
  (req: Request, res: Response) => {
    res.status(200).send('Authenticated');
  },
);

async function buildUser(): Promise<IUser> {
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

beforeAll(async () => {
  await connectDB();
  await User.deleteOne({ providerId: 'dummyId' });
  await User.create(await buildUser());
});

describe('Authenticate Cookie Middleware', () => {
  it('should authenticate using a valid cookie', async () => {
    const user = await User.findOne({ providerId: 'dummyId' });
    const signedCookie = `s:${cookieSignature.sign(user!.accessToken, process.env.COOKIE_SECRET!)}`;

    const res = await request(app)
      .post('/test-authenticate-cookie-middleware-only')
      .set('Cookie', `endchess-token=${signedCookie}`);

    expect(res.status).toBe(200);
    expect(res.text).toBe('Authenticated');
  });

  it('should not authenticate without a cookie', async () => {
    const res = await request(app).post(
      '/test-authenticate-cookie-middleware-only',
    );

    expect(res.status).toBe(401);
  });

  it('should not authenticate with an invalid cookie', async () => {
    const invalidSignedCookie = `s:${cookieSignature.sign('invalidToken', process.env.COOKIE_SECRET!)}`;

    const res = await request(app)
      .post('/test-authenticate-cookie-middleware-only')
      .set('Cookie', `endchess-token=${invalidSignedCookie}`);

    expect(res.status).toBe(401);
  });
});
