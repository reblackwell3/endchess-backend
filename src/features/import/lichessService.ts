import axios from 'axios'; 
import buildGame from './buildGameService'; 
import parsePgn from './parsePgn'; 
import { IGame } from '../games/gameModel'

interface LichessGame {
    Moves: string;
    save: () => Promise<void>;
    // Add other properties that you expect from a game object if needed
}

async function importGamesLichess(gamesData: LichessGame[]): Promise<void> {
    try {
        const games = gamesData
            .map(g => buildGame(g, 'Lichess'))
            .filter((game): game is IGame => game !== null);

        console.log(`${games.length} games have been built`);
        await Promise.all(games.map(game => game.save()));
        console.log('Lichess games successfully processed and data imported');
    } catch (err) {
        const error = err as Error;
        console.error(`Error importing Lichess games: ${error.message}`);
    }
}

export async function readGamesFromLichess(username: string): Promise<void> {
    try {
        const MAX_10_GAMES_FOR_TESTING = 10;

        const response = await axios.get(`https://lichess.org/api/games/user/${username}`, {
            headers: {
                'Accept': 'application/x-chess-pgn'
            },
            params: {
                evals: true,
                opening: true,
                moves: true,
                max: MAX_10_GAMES_FOR_TESTING,
            },
            responseType: 'text' 
        });

        const pgnText = response.data;
        console.log(`pgnText: ${pgnText}`);

        const gamesData: LichessGame[] = parsePgn(pgnText)
            .map(parsed => buildGame(parsed, 'Pgn'))
            .filter((game): game is IGame => game !== null);

        await importGamesLichess(gamesData);

        console.log('Lichess games successfully processed and data imported');
    } catch (err) {
        const error = err as Error;
        console.error(`Error importing Lichess games: ${error.message}`);
        throw new Error('Failed to import Lichess games');
    }
}
