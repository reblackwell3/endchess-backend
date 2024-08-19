// Import necessary modules and services
const axios = require('axios'); // For making HTTP requests
const buildGame = require('./buildGameService'); // Service to build game objects


async function importGamesChessCom(gamesData) {
    try {
        const games = gamesData.map(g => {
            return {...buildGame(g, 'Chess.com')};
        });

        console.log(`${games.length} games have been built`);
        await Promise.all(games.filter(game => game && game.Moves !== '').map(game => game.save()));
        console.log('Chess.com games successfully processed and data imported');
    } catch (err) {
        console.error(`Error importing Chess.com games: ${err.message}`);
    }
}

async function readGamesFromChessCom(username) {
    try {
        console.log('Fetching archives from Chess.com API');
        const archivesResponse = await axios.get(`https://api.chess.com/pub/player/${username}/games/archives`);
        const archiveUrls = archivesResponse.data.archives;

        for (const url of archiveUrls) {
            const gamesResponse = await axios.get(url);
            const gamesData = gamesResponse.data.games;
            console.log(gamesData);

            // Delegate to the import service to process and save the games
            await importGamesChessCom(gamesData);
        }

        console.log('Chess.com games imported successfully');
    } catch (error) {
        console.error('Error importing Chess.com games:', error);
        throw new Error('Failed to import Chess.com games');
    }
}

module.exports = { readGamesFromChessCom }