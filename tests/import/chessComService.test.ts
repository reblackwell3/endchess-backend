import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { readGamesFromChessCom } from '../../src/features/import/chessComImportService'; // Adjust the import path accordingly
import Game from '../../src/features/games/gameModel'; // Adjust path if necessary
import Player from '../../src/features/players/playerModel'; // Import Player model
import twoUserGames from '../__data__/two-games.blackfromchina.chesscom.json';

jest.mock('../../src/features/games/gameModel');
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

  it('should not duplicate games', async () => {
    const chesscom_username = 'chesscom';
    const endchess_username = 'endchess';

    const mockArchivesResponse = {
      archives: ['https://api.chess.com/pub/player/testuser/games/2024/01'],
    };

    const mockGame = {
      _id: 'someObjectId',
    };

    axiosMock
      .onGet(
        `https://api.chess.com/pub/player/${chesscom_username}/games/archives`,
      )
      .reply(200, mockArchivesResponse);
    axiosMock
      .onGet(mockArchivesResponse.archives[0])
      .reply(200, { games: twoUserGames });

    // Mock isDuplicateGame to return true, simulating a duplicate game
    (Game.findOne as jest.Mock).mockResolvedValue(mockGame);

    // Mock Player.findByIdAndUpdate to simulate updating the user's imported games
    const updateMock = jest.fn().mockResolvedValue(undefined);
    (Player.findByIdAndUpdate as jest.Mock) = updateMock;

    await readGamesFromChessCom(chesscom_username, endchess_username);

    // Ensure that no new games are saved due to duplication
    expect(Game.prototype.save).not.toHaveBeenCalled();

    // Verify that the player's imported games were updated with the existing game ID
    expect(Player.findByIdAndUpdate).not.toHaveBeenCalled();
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

    await readGamesFromChessCom(chesscom_username, endchess_username);

    expect(Game.prototype.save).toHaveBeenCalledTimes(twoUserGames.length);
  });
});
