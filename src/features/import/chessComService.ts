import axios from 'axios';
import fs from 'fs';
import path from 'path';
import Game, { IGame } from '../games/gameModel'; // Assuming Game is the Mongoose model

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

function buildGame(gameData: ChessComGameData, source: string): IGame | null {
  try {
    const game = new Game({
      GameId: `game_${gameData.white.username}_${gameData.black.username}_${new Date(gameData.end_time * 1000).toISOString().split('T')[0]}`,
      WhitePlayer: gameData.white.username || '',
      BlackPlayer: gameData.black.username || '',
      Result:
        gameData.white.result === 'win'
          ? '1-0'
          : gameData.black.result === 'win'
            ? '0-1'
            : '1/2-1/2',
      Date: new Date(gameData.end_time * 1000).toISOString().split('T')[0],
      Opening: gameData.opening ? gameData.opening.name : 'Unknown',
      Moves: gameData.pgn || '',
      PGN: gameData.pgn || '',
      WhiteElo: gameData.white.rating || 0,
      BlackElo: gameData.black.rating || 0,
      WhiteRatingDiff: gameData.white.ratingDiff || 0,
      BlackRatingDiff: gameData.black.ratingDiff || 0,
      ECO: gameData.opening?.eco || 'Unknown',
      TimeControl: gameData.time_control || '',
      Termination: gameData.termination || '',
      ImportFrom: source,
    });

    return game;
  } catch (err) {
    console.error('Error building game:', err);
    return null;
  }
}

async function importGamesChessCom(
  gamesData: ChessComGameData[],
): Promise<void> {
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
    throw new Error('Failed to import games to the database');
  }
}

export async function readGamesFromChessCom(username: string): Promise<void> {
  try {
    const filePath = path.join(
      __dirname,
      '../../../data',
      `${username}_games.chesscom.json`,
    );

    let gamesData: ChessComGameData[];

    if (fs.existsSync(filePath)) {
      console.log(`File found at ${filePath}, reading game data...`);
      const fileData = fs.readFileSync(filePath, 'utf8');
      gamesData = JSON.parse(fileData) as ChessComGameData[];
    } else {
      console.log(
        `File not found at ${filePath}, fetching game data from Chess.com...`,
      );

      const archivesResponse = await axios.get(
        `https://api.chess.com/pub/player/${username}/games/archives`,
      );
      const archiveUrls: string[] = archivesResponse.data.archives;

      gamesData = [];

      for (const url of archiveUrls) {
        const gamesResponse = await axios.get(url);
        const newGamesData: ChessComGameData[] = gamesResponse.data.games;
        gamesData.push(...newGamesData);
      }

      fs.writeFileSync(filePath, JSON.stringify(gamesData, null, 2), 'utf8');
      console.log(`Game data fetched and saved to ${filePath}`);
    }

    await importGamesChessCom(gamesData);
    console.log('Chess.com games successfully processed and data imported');
  } catch (err) {
    const error = err as Error;
    console.error(
      `Error importing Chess.com games for user ${username}: ${error.message}`,
      error.stack,
    );
    throw new Error('Failed to import Chess.com games');
  }
}
