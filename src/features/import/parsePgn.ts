import { log } from 'console';
import pgnParser, { PgnGameData } from 'pgn-parser';

export function parsePgn(pgnText: string): PgnGameData[] {
  try {
    const pgns = pgnText.split(/\n\n(?=\[Event)/).filter(Boolean);

    console.log(`${pgns.length} number of pgns in pgn parser`);

    const pgnDataArray = pgns
      // Filter PGNs to accept only "Standard" or "Chess960" variants
      .filter((pgn) => {
        const match = pgn.match(/\[Variant\s+\"([^\"]+)\"\]/i);
        if (!match) return true; // If there's no Variant tag, assume it's "Standard"
        const variant = match[1].toLowerCase();
        return variant === 'standard' || variant === 'chess960';
      })
      .map((pgn) => {
        const UNWRAP_ARRAY_OF_1 = 0;
        const pgnData: PgnGameData = pgnParser.parse(pgn)[UNWRAP_ARRAY_OF_1];
        return {
          ...pgnData,
          pgn: pgn,
        };
      });

    // log(`${JSON.stringify(pgnDataArray, null, 2)}`);
    console.log(`${pgnDataArray.length} pgns returned from parse pgn`);
    return pgnDataArray;
  } catch (error) {
    console.error('Error parsing PGN data:', error);
    throw error;
  }
}
