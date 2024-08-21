import axios from 'axios';
import fs from 'fs';
import path from 'path';
import parsePgn from './parsePgn';
import Game, { IGame } from '../games/gameModel'; // Assuming Game is the Mongoose model
import { PgnGameData } from 'pgn-parser';

function buildGame(pgnGameData: PgnGameData, source: string): IGame | null {
  try {
    const game = new Game({
      GameId: `game_${pgnGameData.headers.White}_${pgnGameData.headers.Black}_${pgnGameData.headers.UTCDate}`,
      WhitePlayer: pgnGameData.headers.White || '',
      BlackPlayer: pgnGameData.headers.Black || '',
      Result: pgnGameData.headers.Result || '1/2-1/2',
      Date: pgnGameData.headers.UTCDate,
      Opening: pgnGameData.headers.Opening || 'Unknown',
      Moves: pgnGameData.moves.map((m) => m.move).join(' ') || '',
      PGN: pgnGameData.raw || '',
      WhiteElo: parseInt(pgnGameData.headers.WhiteElo) || 0,
      BlackElo: parseInt(pgnGameData.headers.BlackElo) || 0,
      WhiteRatingDiff: pgnGameData.headers.WhiteRatingDiff
        ? parseInt(pgnGameData.headers.WhiteRatingDiff)
        : 0,
      BlackRatingDiff: pgnGameData.headers.BlackRatingDiff
        ? parseInt(pgnGameData.headers.BlackRatingDiff)
        : 0,
      ECO: pgnGameData.headers.ECO || 'Unknown',
      TimeControl: pgnGameData.headers.TimeControl || '',
      Termination: pgnGameData.headers.Termination || '',
      ImportFrom: source,
    });

    return game;
  } catch (err) {
    console.error('Error building game:', err);
    return null;
  }
}

async function importGamesLichess(games: IGame[]): Promise<void> {
  try {
    await Promise.all(
      games
        .map((g) => {
          g.ImportFrom = 'Lichess-Pgn-TESTING';
          return g;
        })
        .map(async (game) => {
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
      `${username}_games.pgn`,
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
      .map((parsed) => buildGame(parsed, 'Lichess'))
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
