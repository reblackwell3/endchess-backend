import axios from 'axios';
import Game, { IGame } from '../games/gameModel';  // Assuming Game is the Mongoose model

interface ChessComGameData {
  white: {
    username: string;
    result: string;
    rating: number;
    ratingDiff?: number;
  };
  black: {
    username: string;
    result: string;
    rating: number;
    ratingDiff?: number;
  };
  end_time: number;
  opening?: { name: string; eco: string };
  pgn: string;
  time_control: string;
  termination: string;
}

function buildGame(chessComGameData: ChessComGameData, source: string): IGame | null {
  try {
    const game = new Game({
      GameId: `game_${chessComGameData.white.username}_${chessComGameData.black.username}_${new Date(chessComGameData.end_time * 1000).toISOString().split('T')[0]}`,
      WhitePlayer: chessComGameData.white.username || '',
      BlackPlayer: chessComGameData.black.username || '',
      Result:
        chessComGameData.white.result === 'win'
          ? '1-0'
          : chessComGameData.black.result === 'win'
          ? '0-1'
          : '1/2-1/2',
      Date: new Date(chessComGameData.end_time * 1000)
        .toISOString()
        .split('T')[0],
      Opening: chessComGameData.opening
        ? chessComGameData.opening.name
        : 'Unknown',
      Moves: chessComGameData.pgn || '',
      PGN: chessComGameData.pgn || '',
      WhiteElo: chessComGameData.white.rating || 0,
      BlackElo: chessComGameData.black.rating || 0,
      WhiteRatingDiff: chessComGameData.white.ratingDiff || 0,
      BlackRatingDiff: chessComGameData.black.ratingDiff || 0,
      ECO: chessComGameData.opening?.eco || 'Unknown',
      TimeControl: chessComGameData.time_control || '',
      Termination: chessComGameData.termination || '',
      ImportFrom: source,
    });

    return game;
  } catch (err) {
    console.error('Error building game:', err);
    return null;
  }
}

async function importGamesChessCom(gamesData: ChessComGameData[]): Promise<void> {
  try {
    const games = gamesData
      .map((g) => buildGame(g, 'Chess.com'))
      .filter((game): game is IGame => game !== null);

    console.log(`${games.length} games have been built`);
    await Promise.all(games.map((game) => game!.save()));
    console.log('Chess.com games successfully processed and data imported');
  } catch (err) {
    const error = err as Error;
    console.error(`Error importing Chess.com games: ${error.message}`);
  }
}

export async function readGamesFromChessCom(username: string): Promise<void> {
  try {
    console.log('Fetching archives from Chess.com API');
    const archivesResponse = await axios.get(
      `https://api.chess.com/pub/player/${username}/games/archives`,
    );
    const archiveUrls: string[] = archivesResponse.data.archives;

    for (const url of archiveUrls) {
      const gamesResponse = await axios.get(url);
      const gamesData: ChessComGameData[] = gamesResponse.data.games;
      console.log(gamesData);

      await importGamesChessCom(gamesData);
    }

    console.log('Chess.com games imported successfully');
  } catch (error) {
    console.error('Error importing Chess.com games:', error);
    throw new Error('Failed to import Chess.com games');
  }
}
