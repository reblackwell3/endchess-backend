import fs from 'fs';
import path from 'path';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { readGamesFromLichess } from '../../src/features/import/lichessService';
import Game from '../../src/features/games/gameModel';
import { parsePgn } from '../../src/features/import/parsePgn'; // Import parsePgn to mock it

jest.mock('../../src/features/games/gameModel');
jest.mock('../../src/features/import/parsePgn'); // Mock parsePgn

describe('readGamesFromLichess', () => {
  let mock: MockAdapter;
  const username = 'testuser';
  const mockFilePath = path.join(__dirname, '../data/two-games.pgn');

  beforeEach(() => {
    mock = new MockAdapter(axios);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mock.restore();
  });

  it('should read from file, parse PGN, and save games when the file exists', async () => {
    // Read the mock PGN data from the file
    const mockPgnData = fs.readFileSync(mockFilePath, 'utf8');

    // Create the mock parsed games based on the actual file contents
    const mockParsedGames = [
      {
        headers: [
          {
            name: 'Event',
            value:
              'Rated Classical tournament https://lichess.org/tournament/LfF4Il74',
          },
          { name: 'Site', value: 'https://lichess.org/GbvwpLxO' },
          { name: 'White', value: 'borgs' },
          { name: 'Black', value: 'IntiTupac' },
          { name: 'Result', value: '0-1' },
          { name: 'UTCDate', value: '2016.02.29' },
          { name: 'UTCTime', value: '23:00:03' },
          { name: 'WhiteElo', value: '1726' },
          { name: 'BlackElo', value: '1702' },
          { name: 'ECO', value: 'A13' },
          { name: 'Opening', value: 'English Opening: Agincourt Defense #3' },
          { name: 'TimeControl', value: '600+0' },
          { name: 'Termination', value: 'Time forfeit' },
        ],
        pgn: `1. c4 e6 2. Nf3 a6 3. g3 g6 4. Bg2 Bg7 5. O-O Ne7 6. d4 d5 7. cxd5 exd5 8. Nc3 O-O 9. Bf4 b5 10. a3 Nf5 11. Rc1 Nc6 12. e3 b4 13. Na4 Na5 14. Bxc7 Qe7 15. Bxa5 bxa3 16. bxa3 Qxa3 17. Ra1 Qd6 18. Nb6 Rb8 19. Nxc8 Rfxc8 20. Qd3 Rb5 21. Bd2 Rcb8 22. Rfb1 R8b7 23. Rxb5 Rxb5 24. Rb1 Qc6 25. Rxb5 axb5 26. Bb4 Bf8 27. Bxf8 Kxf8 28. Ne5 Qc1+ 29. Qf1 Qb2 30. Bxd5 f6 31. Nd7+ Ke7 32. Nc5 Nxd4 33. exd4 Qxd4 34. Qe2+ Kd6 35. Ne4+ Kd5 36. Nd2 Kc6 37. Qe6+ Qd6 38. Qxd6+ Kxd6 39. Ne4+ Ke6 40. Nc3 b4 41. Na4 Kd5 42. f4 Kc4 43. Kf2 Kb3 44. Nc5+ Kc2 45. Ke3 b3 46. Nxb3 Kxb3 0-1`,
      },
      {
        headers: [
          {
            name: 'Event',
            value:
              'Rated Blitz tournament https://lichess.org/tournament/XLiNy5KR',
          },
          { name: 'Site', value: 'https://lichess.org/qAS73D1T' },
          { name: 'White', value: 'BrettDale' },
          { name: 'Black', value: 'Viriskensoshir' },
          { name: 'Result', value: '0-1' },
          { name: 'UTCDate', value: '2016.02.29' },
          { name: 'UTCTime', value: '23:00:03' },
          { name: 'WhiteElo', value: '1905' },
          { name: 'BlackElo', value: '1949' },
          { name: 'ECO', value: 'B72' },
          {
            name: 'Opening',
            value: 'Sicilian Defense: Dragon, Classical Attack',
          },
          { name: 'TimeControl', value: '180+0' },
          { name: 'Termination', value: 'Normal' },
        ],
        pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be2 Bg7 7. Be3 O-O 8. Qd2 Nc6 9. h4 Ng4 10. Bxg4 Bxg4 11. f3 Nxd4 12. Bxd4 Bxd4 13. fxg4 Bxc3 14. Qxc3 Rc8 15. Qd3 Qa5+ 16. c3 Qe5 17. O-O b5 18. Rae1 Rc4 19. h5 Rfc8 20. Qf3 f6 21. hxg6 hxg6 22. Qh3 Kg7 23. Qf3 Rh8 24. g3 b4 25. Qg2 bxc3 26. Rf5 gxf5 27. exf5 Qxe1+ 0-1`,
      },
    ];
    (parsePgn as jest.Mock).mockReturnValue(mockParsedGames);

    // Mock the Game model's save method
    const saveMock = jest.fn().mockResolvedValue(undefined);
    (Game.prototype.save as jest.Mock) = saveMock;

    // Call the function
    await readGamesFromLichess(username);

    // Verify that parsePgn was called with the correct PGN data
    expect(parsePgn).toHaveBeenCalledWith(mockPgnData);

    // Verify that the save method was called for each parsed game
    expect(saveMock).toHaveBeenCalledTimes(mockParsedGames.length);
  });

  it('should fetch PGN data from Lichess, parse it, and save games when the file does not exist', async () => {
    const mockPgnData = fs.readFileSync(mockFilePath, 'utf8');

    // Mock the API call
    mock
      .onGet(`https://lichess.org/api/games/user/${username}`)
      .reply(200, mockPgnData);

    // Mock the parsePgn function to return an array of parsed game objects
    const mockParsedGames = [
      {
        headers: [
          {
            name: 'Event',
            value:
              'Rated Classical tournament https://lichess.org/tournament/LfF4Il74',
          },
          { name: 'Site', value: 'https://lichess.org/GbvwpLxO' },
          { name: 'White', value: 'borgs' },
          { name: 'Black', value: 'IntiTupac' },
          { name: 'Result', value: '0-1' },
          { name: 'UTCDate', value: '2016.02.29' },
          { name: 'UTCTime', value: '23:00:03' },
          { name: 'WhiteElo', value: '1726' },
          { name: 'BlackElo', value: '1702' },
          { name: 'ECO', value: 'A13' },
          { name: 'Opening', value: 'English Opening: Agincourt Defense #3' },
          { name: 'TimeControl', value: '600+0' },
          { name: 'Termination', value: 'Time forfeit' },
        ],
        pgn: `1. c4 e6 2. Nf3 a6 3. g3 g6 4. Bg2 Bg7 5. O-O Ne7 6. d4 d5 7. cxd5 exd5 8. Nc3 O-O 9. Bf4 b5 10. a3 Nf5 11. Rc1 Nc6 12. e3 b4 13. Na4 Na5 14. Bxc7 Qe7 15. Bxa5 bxa3 16. bxa3 Qxa3 17. Ra1 Qd6 18. Nb6 Rb8 19. Nxc8 Rfxc8 20. Qd3 Rb5 21. Bd2 Rcb8 22. Rfb1 R8b7 23. Rxb5 Rxb5 24. Rb1 Qc6 25. Rxb5 axb5 26. Bb4 Bf8 27. Bxf8 Kxf8 28. Ne5 Qc1+ 29. Qf1 Qb2 30. Bxd5 f6 31. Nd7+ Ke7 32. Nc5 Nxd4 33. exd4 Qxd4 34. Qe2+ Kd6 35. Ne4+ Kd5 36. Nd2 Kc6 37. Qe6+ Qd6 38. Qxd6+ Kxd6 39. Ne4+ Ke6 40. Nc3 b4 41. Na4 Kd5 42. f4 Kc4 43. Kf2 Kb3 44. Nc5+ Kc2 45. Ke3 b3 46. Nxb3 Kxb3 0-1`,
      },
      {
        headers: [
          {
            name: 'Event',
            value:
              'Rated Blitz tournament https://lichess.org/tournament/XLiNy5KR',
          },
          { name: 'Site', value: 'https://lichess.org/qAS73D1T' },
          { name: 'White', value: 'BrettDale' },
          { name: 'Black', value: 'Viriskensoshir' },
          { name: 'Result', value: '0-1' },
          { name: 'UTCDate', value: '2016.02.29' },
          { name: 'UTCTime', value: '23:00:03' },
          { name: 'WhiteElo', value: '1905' },
          { name: 'BlackElo', value: '1949' },
          { name: 'ECO', value: 'B72' },
          {
            name: 'Opening',
            value: 'Sicilian Defense: Dragon, Classical Attack',
          },
          { name: 'TimeControl', value: '180+0' },
          { name: 'Termination', value: 'Normal' },
        ],
        pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be2 Bg7 7. Be3 O-O 8. Qd2 Nc6 9. h4 Ng4 10. Bxg4 Bxg4 11. f3 Nxd4 12. Bxd4 Bxd4 13. fxg4 Bxc3 14. Qxc3 Rc8 15. Qd3 Qa5+ 16. c3 Qe5 17. O-O b5 18. Rae1 Rc4 19. h5 Rfc8 20. Qf3 f6 21. hxg6 hxg6 22. Qh3 Kg7 23. Qf3 Rh8 24. g3 b4 25. Qg2 bxc3 26. Rf5 gxf5 27. exf5 Qxe1+ 0-1`,
      },
    ];
    (parsePgn as jest.Mock).mockReturnValue(mockParsedGames);

    // Mock the Game model's save method
    const saveMock = jest.fn().mockResolvedValue(undefined);
    (Game.prototype.save as jest.Mock) = saveMock;

    // Call the function
    await readGamesFromLichess(username);

    // Verify that parsePgn was called with the correct PGN data
    expect(parsePgn).toHaveBeenCalledWith(mockPgnData);

    // Verify that the save method was called for each parsed game
    expect(saveMock).toHaveBeenCalledTimes(mockParsedGames.length);
  });
});
