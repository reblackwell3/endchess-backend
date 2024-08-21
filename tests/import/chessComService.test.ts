import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import fs from 'fs';
import path from 'path';
import { readGamesFromChessCom } from '../../src/features/import/chessComService'; // Adjust the import path accordingly
import Game, { IGame } from '../../src/features/games/gameModel'; // Adjust path if necessary
import twoUserGames from '../data/two-games.blackfromchina.chesscom.json';

jest.mock('fs');
jest.mock('../../src/features/games/gameModel');

const PATH_TO_DATA = '../../data';
const TWO_USER_GAMES_WRAPPED = {
  games: twoUserGames,
};
describe('readGamesFromChessCom', () => {
  let axiosMock: axiosMockAdapter;
  beforeAll(() => {
    axiosMock = new axiosMockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
  });

  afterAll(() => {
    axiosMock.restore();
  });

  it('should fetch from URL and save games when the file does not exist', async () => {
    const mockUsername = 'testuser';
    const mockFilePath = path.join(
      __dirname,
      PATH_TO_DATA,
      `${mockUsername}_games.chesscom.json`,
    );

    const mockArchivesResponse = {
      archives: ['https://api.chess.com/pub/player/testuser/games/2024/01'],
    };

    (fs.existsSync as jest.Mock).mockReturnValue(false);
    axiosMock
      .onGet(`https://api.chess.com/pub/player/${mockUsername}/games/archives`)
      .reply(200, mockArchivesResponse);
    axiosMock
      .onGet(mockArchivesResponse.archives[0])
      .reply(200, TWO_USER_GAMES_WRAPPED);

    await readGamesFromChessCom(mockUsername);

    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(Game.prototype.save).toHaveBeenCalledTimes(twoUserGames.length);
  });

  it('should read from file and save games when the file exists', async () => {
    const mockUsername = 'testuser';
    const mockFilePath = path.join(
      __dirname,
      PATH_TO_DATA,
      `${mockUsername}_games.chesscom.json`,
    );

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify(twoUserGames),
    );

    await readGamesFromChessCom(mockUsername);

    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf8');
    expect(Game.prototype.save).toHaveBeenCalledTimes(twoUserGames.length);
  });
});
