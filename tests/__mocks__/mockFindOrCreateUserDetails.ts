import mockUser from '../__mocks__/mockUser';

function getMockDetails() {
  const {
    provider,
    providerId,
    accessToken,
    email,
    givenName,
    familyName,
    picture,
  } = mockUser;
  return {
    profile: {
      id: providerId,
      provider: provider,
      emails: [{ value: email }],
      displayName: givenName,
      name: { givenName, familyName },
      photos: [{ value: picture }],
    },
    accessToken: accessToken,
    refreshToken: '',
  };
}

const mockDetails = getMockDetails();
export default mockDetails;
