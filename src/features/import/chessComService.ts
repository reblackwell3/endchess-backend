import axios from 'axios'; 
import buildGame from './buildGameService'; 
import { IGame } from '../games/gameModel'

interface ChessComGame {
    Moves: string;
    save: () => Promise<void>;
    // Add other properties that you expect from a game object if needed
}

async function importGamesChessCom(gamesData: ChessComGame[]): Promise<void> {
    try {
        const games = gamesData
            .map(g => buildGame(g, 'Chess.com'))
            .filter((game): game is IGame => game !== null);

        console.log(`${games.length} games have been built`);
        await Promise.all(games.map(game => game.save()));
        console.log('Chess.com games successfully processed and data imported');
    } catch (err) {
        const error = err as Error;
        console.error(`Error importing Chess.com games: ${error.message}`);
    }
}

export async function readGamesFromChessCom(username: string): Promise<void> {
    try {
        console.log('Fetching archives from Chess.com API');
        const archivesResponse = await axios.get(`https://api.chess.com/pub/player/${username}/games/archives`);
        const archiveUrls: string[] = archivesResponse.data.archives;

        for (const url of archiveUrls) {
            const gamesResponse = await axios.get(url);
            const gamesData: ChessComGame[] = gamesResponse.data.games;
            console.log(gamesData);

            await importGamesChessCom(gamesData);
        }

        console.log('Chess.com games imported successfully');
    } catch (error) {
        console.error('Error importing Chess.com games:', error);
        throw new Error('Failed to import Chess.com games');
    }
}
