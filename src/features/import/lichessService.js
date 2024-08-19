// Import necessary modules and services
const Equine = require('equine'); // Assuming Equine is a module for Lichess API interaction
const buildGame = require('./buildGameService'); // Service to build game objects

// New function to import games from Lichess data
async function importGamesLichess(gamesData) {
    try {
        const games = gamesData.map(g => {
            return {...buildGame(g), ImportFrom: 'Lichess'};
        });

        console.log(`${games.length} games have been built`);
        await Promise.all(games.filter(game => game && game.Moves !== '').map(game => game.save()));
        console.log('Lichess games successfully processed and data imported');
    } catch (err) {
        console.error(`Error importing Lichess games: ${err.message}`);
    }
}
 
async function readGamesFromLichess(username) {
    try {
        // Initialize the Equine client
        const client = new Equine(process.env.LICHESS_TOKEN);

        // Fetch the games using the client's game endpoint
        const gamesResponse = await client.user.games({ username: username });

        console.log(gamesResponse.data);

        await importGamesLichess(gamesResponse.data.games);

        console.log('Lichess games successfully processed and data imported');
    } catch (err) {
        console.error(`Error importing Lichess games: ${err.message}`);
        throw new Error('Failed to import Lichess games');
    }
}

module.exports = {readGamesFromLichess}