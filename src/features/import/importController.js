const axios = require('axios');
const { importGamesChessCom, importGamesLichess } = require('./importService'); // Adjust the path as needed

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

// Function to handle importing games from Lichess
async function importLichessGames(req, res) {
    const username = req.params.username;

    try {
        const gamesResponse = await axios.get(`https://lichess.org/api/games/user/${username}?moves=true`, {
            responseType: 'stream',
        });

        let gamesData = '';
        gamesResponse.data.on('data', (chunk) => {
            gamesData += chunk.toString();
        });

        gamesResponse.data.on('end', async () => {
            const games = gamesData.split('\n').filter(Boolean).map(line => JSON.parse(line));

            // Delegate to the import service to process and save the games
            await importGamesLichess(games);

            res.status(200).json({ message: 'Lichess games imported successfully' });
        });

    } catch (error) {
        console.error('Error importing Lichess games:', error);
        res.status(500).json({ error: 'Failed to import Lichess games' });
    }
}

module.exports = { importChesscomGames, importLichessGames };
