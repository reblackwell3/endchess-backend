import axios from 'axios';
import { parsePgn } from './parsePgn';
import { PgnGameData } from 'pgn-parser';
import Game, { IGame } from '../games/gameModel';
import { saveGames, SaveFeedback } from './importService';

export async function readGamesFromLichess(
  lichess_username: string,
  endchess_username: string,
): Promise<SaveFeedback> {
  try {
    const response = await axios.get(
      `https://lichess.org/api/games/user/${lichess_username}`,
      {
        headers: { Accept: 'application/x-chess-pgn' },
        params: { evals: true, opening: true, moves: true },
        responseType: 'text',
      },
    );

    const pgnText = response.data;

    const games: IGame[] = parsePgn(pgnText)
      .map((pgn) => buildGame(pgn))
      .filter((game): game is IGame => game !== null);

    if (games.length === 0) {
      console.log('No valid games found in the PGN data.');
      const emptyFeedback = {};
      return emptyFeedback;
    }

    const feedback = await saveGames(games, endchess_username, 'lichess');
    return feedback;
  } catch (err) {
    const error = err as Error;
    console.error(
      `Error importing Lichess games for user ${lichess_username}: ${error.message}`,
      error.stack,
    );
    throw new Error('Failed to import Lichess games');
  }
}

function buildGame(pgn: PgnGameData): IGame | null {
  try {
    const headers = mapHeaders(pgn.headers);

    // Format the UTC date
    const formattedUTCDate =
      headers.UTCDate?.replace(/\./g, '-') || '1970-01-01';

    // Compute the end_time in Unix timestamp format
    const endTimeDate = new Date(
      `${formattedUTCDate}T${headers.UTCTime || '00:00:00'}Z`,
    );
    const end_time = endTimeDate.getTime() / 1000;

    // Generate the UUID using the refactored function
    const uuid = generateLichessUUID(headers, end_time);

    // Construct the Game object with all required fields
    const game: IGame = new Game({
      import_from: 'lichess',
      url: headers.Site || 'unknown-url',
      pgn: pgn.pgn || '',
      time_control: headers.TimeControl || 'unknown',
      end_time: end_time,
      rated: true,
      tcn: '',
      uuid: uuid,
      initial_setup: headers.Variant === 'Chess960' ? headers.FEN || '' : '',
      fen: '',
      time_class: 'standard', // Default value; adjust if necessary
      rules: headers.Variant || 'standard',
      eco: headers.ECO || '',
      white: {
        rating: parseInt(headers.WhiteElo || '0', 10),
        result: headers.Result?.startsWith('1') ? 'win' : 'lose',
        username: headers.White || 'unknown',
      },
      black: {
        rating: parseInt(headers.BlackElo || '0', 10),
        result: headers.Result?.endsWith('1') ? 'win' : 'lose',
        username: headers.Black || 'unknown',
      },
      result: headers.Result || '1/2-1/2',
    });

    return game;
  } catch (err) {
    console.error('Error building Lichess game:', err);
    return null;
  }
}

function mapHeaders(
  headersArray: { name: string; value: string }[],
): LichessHeaders {
  return headersArray.reduce((acc, { name, value }) => {
    (acc as any)[name] = value;
    return acc;
  }, {} as LichessHeaders);
}

function generateLichessUUID(
  headers: LichessHeaders,
  end_time: number,
): string {
  return `${headers.White}-${headers.Black}-${end_time}`;
}

interface LichessHeaders {
  Event: string;
  Site: string;
  Date: string;
  White: string;
  Black: string;
  Result: string;
  UTCDate: string;
  UTCTime: string;
  Opening: string;
  WhiteElo: string;
  BlackElo: string;
  ECO: string;
  FEN: string;
  TimeControl: string;
  Termination: string;
  Variant: string;
}
