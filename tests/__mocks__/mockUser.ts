import {
  User,
  IUser,
  PlayerData,
  IPlayerData,
  ItemEvent,
  IItemEvent,
} from 'endchess-models';

function buildItemEvent(): IItemEvent {
  const itemEvent = new ItemEvent({
    itemId: 'dummyPuzzleId',
    eventType: 'solved',
    event: 'dummyEvent',
  });

  return itemEvent;
}
function buildPlayerData(): IPlayerData {
  const player = new PlayerData({
    providerId: 'dummyId',
    feature: 'puzzles',
    rating: 1200,
    itemEvents: [],
  });

  return player;
}

function buildUser(): IUser {
  const user = new User({
    provider: 'dummyProvider',
    providerId: 'dummyId',
    accessToken: 'dummyAccessToken',
    refreshToken: 'dummyRefreshToken',
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
