import axios from 'axios';
import fs from 'fs';
import path from 'path';
import Game, { IGame } from '../games/gameModel'; // Assuming Game is the Mongoose model
import { log } from 'console';

async function importGamesChessCom(games: IGame[]): Promise<void> {
  try {
    console.log(`${games.length} games have been built`);
    await Promise.all(
      games
        .map((game) => {
          const newGame = new Game(game);
          newGame.import_from = 'chess.com';
          return newGame;
        })
        .map((game) => game.save()),
    );

    console.log('Chess.com games successfully processed and data imported');
  } catch (err) {
    const error = err as Error;
    console.error(`Error importing Chess.com games: ${error.message}`);
    throw new Error('Failed to import games to the database');
  }
}

const PATH_TO_DATA = '../../../data';
export async function readGamesFromChessCom(username: string): Promise<void> {
  try {
    const filePath = path.join(
      __dirname,
      PATH_TO_DATA,
      `${username}_games.chesscom.json`,
    );

    let gamesData: IGame[];

    if (fs.existsSync(filePath)) {
      console.log(`File found at ${filePath}, reading game data...`);
      const fileData = fs.readFileSync(filePath, 'utf8');
      gamesData = JSON.parse(fileData) as IGame[];
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
        log(gamesResponse);
        const newGamesData: IGame[] = gamesResponse.data.games;
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
