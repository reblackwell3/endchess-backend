import { User, IUser, PlayerData, ItemEvent } from 'endchess-models';

function buildUser(): IUser {
  const itemEvent = new ItemEvent({
    itemId: 'dummyPuzzleId',
    eventType: 'solved',
    event: 'dummyEvent',
  });
  const player = new PlayerData({
    providerId: 'dummyId',
    feature: 'puzzles',
    rating: 1200,
    itemEvents: [],
  });

  const user = new User({
    provider: 'dummyProvider',
    providerId: 'dummyId',
    accessToken: 'dummyAccessToken',
    refreshToken: 'dummyRefreshToken',
    player,
    email: 'dummy@example.com',
    emailVerified: true,
    name: 'Dummy User',
    givenName: 'Dummy',
    familyName: 'User',
    picture: 'http://example.com/dummy.jpg',
  });

  return user;
}

const mockUser = buildUser();
export default mockUser;
