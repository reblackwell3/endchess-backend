import axios from 'axios';
import Game, { IGame } from '../games/gameModel';
import { saveGames, SaveFeedback } from './importService'; // Assuming importService has been refactored to export functions

export async function readGamesFromChessCom(
  chesscom_username: string,
  endchess_username: string,
): Promise<SaveFeedback> {
  try {
    const archivesResponse = await axios.get(
      `https://api.chess.com/pub/player/${chesscom_username}/games/archives`,
    );
    const archiveUrls: string[] = archivesResponse.data.archives;

    const gamesData: IGame[] = [];

    for (const url of archiveUrls) {
      const gamesResponse = await axios.get(url);
      const newGamesData: IGame[] = gamesResponse.data.games;
      gamesData.push(...newGamesData);
    }

    const feedback = await saveGames(gamesData, endchess_username, 'chess.com');
    return feedback;
  } catch (err) {
    const error = err as Error;
    console.error(
      `Error importing Chess.com games for user ${chesscom_username}: ${error.message}`,
      error.stack,
    );
    throw new Error('Failed to import Chess.com games');
  }
}
