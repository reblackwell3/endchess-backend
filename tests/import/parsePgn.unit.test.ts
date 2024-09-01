import fs from 'fs';
import path from 'path';
import { parsePgn } from '../../src/features/import/parsePgn'; // Correct import
import { PgnGameData } from 'pgn-parser';

describe('parsePgn', () => {
  it('should parse a PGN file with multiple games correctly', async () => {
    const pgnPath = path.resolve(__dirname, '../__data__/two-games.pgn');

    // Read the PGN file content as a string
    const pgnContent = fs.readFileSync(pgnPath, 'utf8');

    // Parse the PGN content
    const pgns: PgnGameData[] = parsePgn(pgnContent);

    // Assert the parsed PGN data
    expect(pgns).toHaveLength(2);
  });
  it('should drop variants', async () => {
    const pgnPath = path.resolve(
      __dirname,
      '../__data__/variants-and-standard.pgn',
    );

    // Read the PGN file content as a string
    const pgnContent = fs.readFileSync(pgnPath, 'utf8');

    // Parse the PGN content
    const pgns: PgnGameData[] = parsePgn(pgnContent);

    // Assert the parsed PGN data
    expect(pgns).toHaveLength(2);
  });
});
