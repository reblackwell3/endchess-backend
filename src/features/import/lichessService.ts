import axios from 'axios';
import fs from 'fs';
import path from 'path';
import parsePgn from './parsePgn';
import Game, { IGame } from '../games/gameModel'; // Assuming Game is the Mongoose model
import { PgnGameData } from 'pgn-parser';

function buildGame(pgn: PgnGameData): IGame | null {
  try {
    const game: IGame = new Game({
      importFrom: 'lichess',
      url: '', // Lichess PGN data might not include a URL, so it's left empty or can be populated if available
      pgn: pgn.raw || '',
      timeControl: pgn.headers.TimeControl || '',
      endTime: new Date(), // You might need to calculate or approximate this if not available in the PGN
      rated: true, // Assuming all games are rated; adjust if necessary
      tcn: '', // Not available in Lichess data
      uuid: '', // Not available in Lichess data
      initialSetup: '', // Not available in Lichess data
      fen: '', // Not available in Lichess data, could derive from PGN
      timeClass: 'unknown', // Map this from Lichess-specific fields
      rules: 'chess', // Assuming standard chess, adjust if necessary
      eco: pgn.headers.ECO || 'Unknown',
      ecoUrl: '', // Not available in Lichess data
      termination: pgn.headers.Termination || 'Unknown',
      white: {
        rating: parseInt(pgn.headers.WhiteElo) || 0,
        result: pgn.headers.Result?.startsWith('1') ? 'win' : 'lose',
        id: '', // Not available in PGN
        username: pgn.headers.White || '',
        uuid: '', // Not available in PGN
      },
      black: {
        rating: parseInt(pgn.headers.BlackElo) || 0,
        result: pgn.headers.Result?.endsWith('1') ? 'win' : 'lose',
        id: '', // Not available in PGN
        username: pgn.headers.Black || '',
        uuid: '', // Not available in PGN
      },
    });

    console.log(`Built game: ${game}`);

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
