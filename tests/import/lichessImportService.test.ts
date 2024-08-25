import fs from 'fs';
import path from 'path';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { readGamesFromLichess } from '../../src/features/import/lichessImportService';
import Game from '../../src/features/games/gameModel';
import { parsePgn } from '../../src/features/import/parsePgn'; // Import parsePgn to mock it
import { saveGames } from '../../src/features/import/importService'; // Import saveGames to mock it
import { mockParsedGames } from '../__mocks__/mock-parsed-games'; // Import mockParsedGames
import { mockBuiltGames } from '../__mocks__/mock-built-games';

jest.mock('../../src/features/games/gameModel');
jest.mock('../../src/features/import/parsePgn'); // Mock parsePgn
jest.mock('../../src/features/import/importService'); // Mock saveGames

describe('readGamesFromLichess', () => {
  let mock: MockAdapter;
  const lichess_username = 'lichess';
  const endchess_username = 'endchess'; // Add this line to define the userId
  const mockFilePath = path.join(__dirname, '../__data__/two-games.pgn');

  const mockGame = {
    _id: 'id',
    white: { username: 'test' },
    black: { username: 'iersin' },
  };

  beforeEach(() => {
    mock = new MockAdapter(axios);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mock.restore();
  });

  it('should fetch PGN data from Lichess, parse it, and save games', async () => {
    const mockPgnData = fs.readFileSync(mockFilePath, 'utf8');

    mock
      .onGet(`https://lichess.org/api/games/user/${lichess_username}`)
      .reply(200, mockPgnData);

    (parsePgn as jest.Mock).mockReturnValue(mockParsedGames);

    (saveGames as jest.Mock).mockResolvedValue({ inserts: 2 });

    // (Game.findOne as jest.Mock).mockResolvedValue(null);

    await readGamesFromLichess(lichess_username, endchess_username);

    const saveGamesArgs = (saveGames as jest.Mock).mock.calls[0];

    const actualStringify = JSON.stringify(saveGamesArgs[0], null, 2);
    const expectedStringify = JSON.stringify(mockBuiltGames, null, 2);

    expect(actualStringify).toEqual(expectedStringify);

    expect(saveGamesArgs[1]).toBe(endchess_username);

    expect(saveGamesArgs[2]).toBe('lichess');

    expect(saveGames).toHaveBeenCalledTimes(1);
  });
});
