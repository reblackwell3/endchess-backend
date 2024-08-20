import path from 'path';
import { fileURLToPath } from 'url';
import parsePgn from '../../src/features/import/parsePgn'; // Adjust the path as needed

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('parsePgn', () => {
  it('should parse a PGN file with multiple games correctly', async () => {
    const pgnPath = path.resolve(__dirname, '../data/two-games.pgn');
    const parsedPgns = await parsePgn(pgnPath);

    expect(parsedPgns).toHaveLength(2);

    expect(parsedPgns[0].headers.White).toBe('borgs');
    expect(parsedPgns[0].headers.Black).toBe('IntiTupac');
    expect(parsedPgns[0].headers.Result).toBe('0-1');
    expect(parsedPgns[0].headers.UTCDate).toBe('2016.02.29');
    expect(parsedPgns[0].headers.WhiteElo).toBe('1726');
    expect(parsedPgns[0].headers.BlackElo).toBe('1702');
    expect(parsedPgns[0].headers.WhiteRatingDiff).toBe('-12');
    expect(parsedPgns[0].headers.BlackRatingDiff).toBe('+14');
    expect(parsedPgns[0].headers.ECO).toBe('A13');
    expect(parsedPgns[0].headers.TimeControl).toBe('600+0');
    expect(parsedPgns[0].headers.Termination).toBe('Time forfeit');
    expect(parsedPgns[0].moves.map((move) => move.move).join(' ')).toContain('c4 e6 Nf3 a6');

    expect(parsedPgns[1].headers.White).toBe('BrettDale');
    expect(parsedPgns[1].headers.Black).toBe('Viriskensoshir');
    expect(parsedPgns[1].headers.Result).toBe('0-1');
    expect(parsedPgns[1].headers.UTCDate).toBe('2016.02.29');
    expect(parsedPgns[1].headers.WhiteElo).toBe('1905');
    expect(parsedPgns[1].headers.BlackElo).toBe('1949');
    expect(parsedPgns[1].headers.WhiteRatingDiff).toBe('-10');
    expect(parsedPgns[1].headers.BlackRatingDiff).toBe('+10');
    expect(parsedPgns[1].headers.ECO).toBe('B72');
    expect(parsedPgns[1].headers.TimeControl).toBe('180+0');
    expect(parsedPgns[1].headers.Termination).toBe('Normal');
    expect(parsedPgns[1].moves.map((move) => move.move).join(' ')).toContain('e4 c5 Nf3 d6');
  });
});
