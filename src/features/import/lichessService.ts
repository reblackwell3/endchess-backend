import axios from 'axios';
import parsePgn from './parsePgn';
import Game, { IGame } from '../games/gameModel';  // Assuming Game is the Mongoose model
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
      Moves: pgnGameData.moves.map(m => m.move).join(' ') || '',
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
    // Update each game to indicate it was imported from Lichess-Pgn and save it
    const newGames = games.map((g) => {
      g.ImportFrom = 'Lichess-Pgn-TESTING';
      return g;
    });

    console.log(`${newGames.length} games have been set as ImportFrom Lichess`);

    await Promise.all(newGames.map(async (game) => {
      await game.save();
    }));

    console.log(`${games.length} games have been built and saved.`);
    console.log('Lichess games successfully processed and data imported');
  } catch (err) {
    const error = err as Error;
    console.error(`Error importing Lichess games: ${error.message}`, error.stack);
    throw new Error('Failed to import games to the database');
  }
}

export async function readGamesFromLichess(username: string): Promise<void> {
  try {
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
        },
        responseType: 'text',
      },
    );

    const pgnText = response.data;
    console.log(`PGN data retrieved: ${pgnText.slice(0, 200)}...`); // Log only the first 200 characters for brevity

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
    console.error(`Error importing Lichess games for user ${username}: ${error.message}`, error.stack);
    throw new Error('Failed to import Lichess games');
  }
}
