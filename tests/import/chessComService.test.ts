import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { readGamesFromChessCom } from '../../src/features/import/chessComImportService';
import { saveGames } from '../../src/features/import/importService'; // Ensure correct import path
import twoUserGames from '../__data__/two-games.blackfromchina.chesscom.json';

jest.mock('../../src/features/import/importService');
jest.mock('../../src/features/players/playerModel'); // Mock Player model

describe('readGamesFromChessCom', () => {
  let axiosMock: MockAdapter;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
  });

  afterAll(() => {
    axiosMock.restore();
  });

  it('should fetch from URL and save games', async () => {
    const chesscom_username = 'chesscom';
    const endchess_username = 'endchess';

    const mockArchivesResponse = {
      archives: ['https://api.chess.com/pub/player/testuser/games/2024/01'],
    };

    axiosMock
      .onGet(
        `https://api.chess.com/pub/player/${chesscom_username}/games/archives`,
      )
      .reply(200, mockArchivesResponse);
    axiosMock
      .onGet(mockArchivesResponse.archives[0])
      .reply(200, { games: twoUserGames });

    // Mock the saveGames function to simulate saving games
    (saveGames as jest.Mock).mockResolvedValue(undefined);

    await readGamesFromChessCom(chesscom_username, endchess_username);

    // Capture and inspect the arguments passed to saveGames
    const saveGamesArgs = (saveGames as jest.Mock).mock.calls[0];

    // Compare the first argument (the games) to twoUserGames or the processed equivalent
    expect(saveGamesArgs[0]).toEqual(twoUserGames);

    // Compare the second argument (username)
    expect(saveGamesArgs[1]).toBe(endchess_username);

    // Compare the third argument (source)
    expect(saveGamesArgs[2]).toBe('chess.com');
  });
});
