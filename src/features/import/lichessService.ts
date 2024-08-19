import axios from 'axios'; // For making HTTP requests
import buildGame from './buildGameService'; // Service to build game objects
import parsePgn from './parsePgn'; // Assuming you have a function to parse PGN data

interface LichessGame {
    Moves: string;
    save: () => Promise<void>;
    // Add other properties that you expect from a game object if needed
}

// Function to import games from Lichess data
async function importGamesLichess(gamesData: LichessGame[]): Promise<void> {
    try {
        const games = gamesData.map(g => buildGame(g, 'Lichess'));

        console.log(`${games.length} games have been built`);
        await Promise.all(games.filter(game => game && game.Moves !== '').map(game => game.save()));
        console.log('Lichess games successfully processed and data imported');
    } catch (err) {
        const error = err as Error;
        console.error(`Error importing Lichess games: ${error.message}`);
    }
}

// Function to read games from Lichess
export async function readGamesFromLichess(username: string): Promise<void> {
    try {
        const MAX_10_GAMES_FOR_TESTING = 10;

        // Fetch the PGN file from Lichess API with evals included
        const response = await axios.get(`https://lichess.org/api/games/user/${username}`, {
            headers: {
                'Accept': 'application/x-chess-pgn'
            },
            params: {
                evals: true, // Include evaluations (evals) in the PGN
                opening: true, // Include opening names
                moves: true, // Include moves in the PGN
                max: MAX_10_GAMES_FOR_TESTING, // Optionally limit the number of games fetched
            },
            responseType: 'text' // Make sure to get the response as text since it's a PGN file
        });

        const pgnText = response.data;

        console.log(`pgnText: ${pgnText}`);

        // Parse the PGN data (assuming parsePgn function exists)
        const gamesData: LichessGame[] = parsePgn(pgnText);

        // Process and save the games
        await importGamesLichess(gamesData);

        console.log('Lichess games successfully processed and data imported');
    } catch (err) {
        const error = err as Error;
        console.error(`Error importing Lichess games: ${error.message}`);
        console.error(error.stack);
        throw new Error('Failed to import Lichess games');
    }
}
