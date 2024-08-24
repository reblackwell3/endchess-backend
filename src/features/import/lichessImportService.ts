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

    const formattedUTCDate = headers.UTCDate.replace(/\./g, '-');
    const UNKNOWN_VALUE_PLACEHOLDER = 'UNKNOWN';
    const game: IGame = new Game({
      import_from: 'lichess',
      url: headers.Site,
      pgn: pgn.pgn,
      time_control: headers.TimeControl,
      end_time:
        new Date(`${formattedUTCDate}T${headers.UTCTime}Z`).getTime() / 1000,
      rated: true,
      tcn: UNKNOWN_VALUE_PLACEHOLDER,
      uuid: UNKNOWN_VALUE_PLACEHOLDER,
      initial_setup:
        headers.Variant === 'Chess960'
          ? headers.FEN
          : UNKNOWN_VALUE_PLACEHOLDER,
      fen: UNKNOWN_VALUE_PLACEHOLDER,
      time_class: UNKNOWN_VALUE_PLACEHOLDER,
      rules: headers.Variant,
      eco: headers.ECO || UNKNOWN_VALUE_PLACEHOLDER,
      white: {
        rating: parseInt(headers.WhiteElo) || 0,
        result: headers.Result.startsWith('1') ? 'win' : 'lose',
        username: headers.White,
      },
      black: {
        rating: parseInt(headers.BlackElo) || 0,
        result: headers.Result.endsWith('1') ? 'win' : 'lose',
        username: headers.Black,
      },
      result: headers.Result || '',
    });

    game.uuid = generateLichessUUID(game);
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

function generateLichessUUID(game: IGame): string {
  return `${game.white.username}-${game.black.username}-${game.end_time}`;
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
