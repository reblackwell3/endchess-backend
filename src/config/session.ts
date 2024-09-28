import { default as connectMongoDBSession } from 'connect-mongodb-session';
import session from 'express-session';

const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI!,
  collection: 'sessions',
});

const sessionOptions = {
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
};

export const closeSessionStore = async () => {
  await store.client.close();
};

export default session(sessionOptions);
