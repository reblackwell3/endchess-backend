import mockUser from '../__mocks__/mockUser';

function getMockDetails() {
  const { provider, providerId, accessToken, details } = mockUser;
  const { email, givenName, familyName, picture } = details;
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
