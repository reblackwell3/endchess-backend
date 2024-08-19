const axios = require('axios');
const { importGamesChessCom, importGamesLichess } = require('./importService'); // Adjust the path as needed
const { Client } = require('equine');

// Function to handle importing games from Chess.com
async function importChesscomGames(req, res) {
    const username = req.params.username;

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

        res.status(200).json({ message: 'Chess.com games imported successfully' });
    } catch (error) {
        console.error('Error importing Chess.com games:', error);
        res.status(500).json({ error: 'Failed to import Chess.com games' });
    }
}


// New function to import games from Lichess data using Equine
async function importLichessGames(username) {
    try {
        // Initialize the Equine client
        const client = new Client();

        // Fetch the games using the client's game endpoint
        const games = await client.games({ username });

        await importGamesLichess(games);

        console.log('Lichess games successfully processed and data imported');
    } catch (err) {
        console.error(`Error importing Lichess games: ${err.message}`);
    }
}

module.exports = { importChesscomGames, importLichessGames };
