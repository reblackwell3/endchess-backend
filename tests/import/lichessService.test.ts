import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { readGamesFromLichess } from '../../src/features/import/lichessService';
import buildGame from '../../src/features/import/buildGameService';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

describe('readGamesFromLichess', () => {
  let mock: MockAdapter;
  const username = 'blackfromchina';
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const mockPgnPath = path.join(__dirname, 'lichess-import.pgn');
  const mockPgn = fs.readFileSync(mockPgnPath, 'utf8');

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should fetch PGN data, process it with buildGame, and call save', async () => {
    // Mock the API call
    mock.onGet(`https://lichess.org/api/games/user/${username}`).reply(200, mockPgn);

    // Create a mock game object with a save method
    const mockGame = {
      save: jest.fn().mockResolvedValue(undefined),
    };

    // Stub the buildGame function to return the mock game
    const buildGameStub = jest.spyOn(buildGame, 'buildGame').mockReturnValue(mockGame as any);

    // Call the function
    await readGamesFromLichess(username);

    // Verify that buildGame was called with the correct parameters
    expect(buildGameStub).toHaveBeenCalled();
    expect(buildGameStub).toHaveBeenCalledWith(expect.anything(), 'Pgn');

    // Verify that save was called on the mock game
    expect(mock
