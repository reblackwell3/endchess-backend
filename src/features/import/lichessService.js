// Import necessary modules and services
const axios = require('axios'); // For making HTTP requests
const buildGame = require('./buildGameService'); // Service to build game objects
const parsePgn = require('./parsePgn'); // Assuming you have a function to parse PGN data

// Function to import games from Lichess data
async function importGamesLichess(gamesData) {
    try {
        const games = gamesData.map(g => {
            return {...buildGame(g, 'Pgn'), ImportFrom: 'Lichess'};
        });

        console.log(`${games.length} games have been built`);
        await Promise.all(games.filter(game => game && game.Moves !== '').map(game => game.save()));
        console.log('Lichess games successfully processed and data imported');
    } catch (err) {
        console.error(`Error importing Lichess games: ${err.message}`);
    }
}

// Function to read games from Lichess
async function readGamesFromLichess(username) {
    try {
      

        // todo: for testing
        // Calculate timestamps for 1 year ago and 9 months ago
        const oneYearAgo = 1692459530;

        // Fetch the PGN file from Lichess API with evals included
        const response = await axios.get(`https://lichess.org/api/games/user/${username}`, {
            headers: {
                'Accept': 'application/x-chess-pgn'
            },
            params: {
                evals: true, // Include evaluations (evals) in the PGN
                opening: true, // Include opening names
                moves: true, // Include moves in the PGN
                max: 1000, // Optionally limit the number of games fetched
                since: oneYearAgo
            },
            responseType: 'text' // Make sure to get the response as text since it's a PGN file
        });

        const pgnFile = response.data;

        console.log(`pgnFile: ${pgnFile}`);

        // Parse the PGN data (assuming parsePgn function exists)
        const gamesData = parsePgn(pgnFile);

        // Process and save the games
        await importGamesLichess(gamesData);

        console.log('Lichess games successfully processed and data imported');
    } catch (err) {
        console.error(`Error importing Lichess games: ${err.message}`);
        throw new Error('Failed to import Lichess games');
    }
}

// Exporting the function
module.exports = { readGamesFromLichess };

// Reference: https://lichess.org/api#tag/Games/operation/apiGamesUser
