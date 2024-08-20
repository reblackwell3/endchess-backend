import pgnParser from 'pgn-parser';
import { PgnGameData } from './gameDataInterfaces.js';

interface PgnHeader {
  name: string;
  value: string;
}

// Updated chessVariants to include both variations of certain variants
const chessVariants = [
  'ultraBullet', 'bullet', 'blitz', 'rapid', 'classical', 'correspondence',
  'chess960', 'crazyhouse', 'antichess', 'atomic', 'horde',
  'king of the hill', 'kingOfTheHill',
  'racing kings', 'racingKings',
  'three-check', 'threeCheck'
];

function doesNotContainVariant(pgn: string): boolean {
  // Perform a case-insensitive search in the entire PGN string
  const lowerCasePgn = pgn.toLowerCase();
  return !chessVariants.some(variant => lowerCasePgn.includes(variant.toLowerCase()));
}

function createPgnGameData(parsed: any, raw: string): PgnGameData {
  const headers = parsed.headers.reduce((acc: any, header: any) => {
    acc[header.name] = header.value;
    return acc;
  }, {});  

  return {
    headers: {
      White: headers['White'] || '',
      Black: headers['Black'] || '',
      Result: headers['Result'] || '',
      UTCDate: headers['UTCDate'] || '',
      Opening: headers['Opening'],
      WhiteElo: headers['WhiteElo'] || '',
      BlackElo: headers['BlackElo'] || '',
      WhiteRatingDiff: headers['WhiteRatingDiff'],
      BlackRatingDiff: headers['BlackRatingDiff'],
      ECO: headers['ECO'],
      TimeControl: headers['TimeControl'],
      Termination: headers['Termination'],
    },  
    moves: parsed.moves.map((move: any) => ({ move: move.move })),
    raw: raw,
  };  
}  

function parsePgn(pgnText: string): PgnGameData[] {
  try {
    const pgns = pgnText.split(/\n\n(?=\[Event)/).filter(Boolean);

    console.log(`${pgns.length} number of pgns in pgn parser`);

    const parsedPgns = pgns
    .filter(pgn => doesNotContainVariant(pgn))
    .map((pgn) =>
      createPgnGameData(pgnParser.parse(pgn)[0], pgn),  
    );

    return parsedPgns;
  } catch (error) {
    console.error('Error parsing PGN data:', error);
    throw error;
  }  
}  

export default parsePgn;
