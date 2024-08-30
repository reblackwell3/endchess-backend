import User, { IUser } from '../../src/features/user/userModel';
import UserDetails from '../../src/features/user/userDetailsModel';
import Player from '../../src/features/user/playerModel';
import exp from 'constants';

function buildUser(): IUser {
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

const mockUser = buildUser();
export default mockUser;
