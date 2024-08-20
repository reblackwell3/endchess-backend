import axios from 'axios';
import buildGame from './buildGameService.js';
import parsePgn from './parsePgn.js';
import { IGame } from '../games/gameModel.js';

async function importGamesLichess(games: IGame[]): Promise<void> {
  try {
    // Update each game to indicate it was imported from Lichess-Pgn and save it
    await Promise.all(
      games.map(async (game) => {
        game.ImportFrom = 'Lichess-Pgn';
        await game.save();
      }),
    );

    console.log(`${games.length} games have been built and saved.`);
    console.log('Lichess games successfully processed and data imported');
  } catch (err) {
    const error = err as Error;
    console.error(`Error importing Lichess games: ${error.message}`);
  }
}

export async function readGamesFromLichess(username: string): Promise<void> {
  try {
    const MAX_10_GAMES_FOR_TESTING = 10;

    const response = await axios.get(
      `https://lichess.org/api/games/user/${username}`,
      {
        headers: {
          Accept: 'application/x-chess-pgn',
        },
        params: {
          evals: true,
          opening: true,
          moves: true,
          max: MAX_10_GAMES_FOR_TESTING,
        },
        responseType: 'text',
      },
    );

    const pgnText = response.data;
    console.log(`pgnText: ${pgnText}`);

    const games: IGame[] = parsePgn(pgnText)
      .map((parsed) => buildGame(parsed, 'Pgn'))
      .filter((game): game is IGame => game !== null);

    await importGamesLichess(games);

    console.log('Lichess games successfully processed and data imported');
  } catch (err) {
    const error = err as Error;
    console.error(`Error importing Lichess games: ${error.message}`);
    throw new Error('Failed to import Lichess games');
  }
}
