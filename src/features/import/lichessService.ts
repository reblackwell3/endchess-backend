import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { parsePgn } from './parsePgn';
import { PgnGameData } from 'pgn-parser';
import Game, { IGame } from '../games/gameModel'; // Assuming Game is the Mongoose model
import { log } from 'console';

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
  // WhiteRatingDiff: string;
  // BlackRatingDiff: string;
  ECO: string;
  FEN: string;
  TimeControl: string;
  Termination: string;
  Variant: string;
}

function mapHeaders(
  headersArray: { name: string; value: string }[],
): LichessHeaders {
  return headersArray.reduce((acc, { name, value }) => {
    (acc as any)[name] = value; // Temporarily casting acc as any
    return acc;
  }, {} as LichessHeaders);
}

function buildGame(pgn: PgnGameData): IGame | null {
  try {
    const headers = mapHeaders(pgn.headers); // Map headers to LichessHeaders format

    const formattedUTCDate = headers.UTCDate.replace(/\./g, '-');
    // Parse the datetime string into a Date object

    const UNKNOWN_VALUE_PLACEHOLDER = 'UNKNOWN';
    const game: IGame = new Game({
      import_from: 'lichess',
      url: headers.Site, // Use the mapped headers
      pgn: pgn.pgn,
      time_control: headers.TimeControl,
      end_time:
        new Date(`${formattedUTCDate}T${headers.UTCTime}Z`).getTime() / 1000, // You might need to calculate or approximate this if not available in the PGN
      rated: true, // Assuming all games are rated; adjust if necessary
      tcn: UNKNOWN_VALUE_PLACEHOLDER, // Not available in Lichess data
      uuid: UNKNOWN_VALUE_PLACEHOLDER, // Not available in Lichess data
      initial_setup:
        headers.Variant === 'Chess960'
          ? headers.FEN
          : UNKNOWN_VALUE_PLACEHOLDER, // Not available in Lichess data
      fen: UNKNOWN_VALUE_PLACEHOLDER, // Not available in Lichess data, could derive from PGN
      time_class: UNKNOWN_VALUE_PLACEHOLDER, // Map this from Lichess-specific fields
      rules: headers.Variant, // Assuming standard chess, adjust if necessary
      eco: headers.ECO || UNKNOWN_VALUE_PLACEHOLDER,
      white: {
        rating: parseInt(headers.WhiteElo) || 0,
        result: headers.Result.startsWith('1') ? 'win' : 'lose',
        username: headers.White || '',
      },
      black: {
        rating: parseInt(headers.BlackElo) || 0,
        result: headers.Result.endsWith('1') ? 'win' : 'lose',
        username: headers.Black || '',
      },
      result: headers.Result || '',
    });

    return game;
  } catch (err) {
    console.error('Error building Lichess game:', err);
    return null;
  }
}

async function importGamesLichess(games: IGame[]): Promise<void> {
  try {
    await Promise.all(
      games.map(async (game) => {
        await game.save();
      }),
    );

    console.log(`${games.length} games have been built and saved.`);
    console.log('Lichess games successfully processed and data imported');
  } catch (err) {
    const error = err as Error;
    console.error(
      `Error importing Lichess games: ${error.message}`,
      error.stack,
    );
    throw new Error('Failed to import games to the database');
  }
}

export async function readGamesFromLichess(username: string): Promise<void> {
  try {
    const filePath = path.join(
      __dirname,
      '../../../data',
      `${username}_games.lichess.pgn`,
    );

    var pgnText;
    if (fs.existsSync(filePath)) {
      console.log(`File found at ${filePath}, reading PGN data...`);
      pgnText = fs.readFileSync(filePath, 'utf8');
    } else {
      console.log(
        `File not found at ${filePath}, fetching PGN data from Lichess...`,
      );
      try {
        const response = await axios.get(
          `https://lichess.org/api/games/user/${username}`,
          {
            headers: { Accept: 'application/x-chess-pgn' },
            params: { evals: true, opening: true, moves: true },
            responseType: 'text',
          },
        );
        fs.writeFileSync(filePath, response.data, 'utf8');
        console.log(`PGN data fetched and saved to ${filePath}`);
        pgnText = response.data;
      } catch (err) {
        const error = err as Error;
        console.error(`Error fetching PGN data: ${error.message}`);
        throw error; // Optionally rethrow the error to handle it further up
      }
    }

    const games: IGame[] = parsePgn(pgnText)
      .map((pgn) => buildGame(pgn))
      .filter((game): game is IGame => game !== null);

    if (games.length === 0) {
      console.log('No valid games found in the PGN data.');
      return;
    }

    await importGamesLichess(games);
    console.log('Lichess games successfully processed and data imported');
  } catch (err) {
    const error = err as Error;
    console.error(
      `Error importing Lichess games for user ${username}: ${error.message}`,
      error.stack,
    );
    throw new Error('Failed to import Lichess games');
  }
}
