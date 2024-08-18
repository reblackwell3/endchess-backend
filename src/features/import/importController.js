const axios = require('axios');
const { importGamesData } = require('./importService'); // Adjust the path as needed

// Function to handle importing games from Chess.com
async function importChesscomGames(req, res) {
  const username = req.params.username;

  try {
    // Fetch the list of archives for the user
    const archivesResponse = await axios.get(`https://api.chess.com/pub/player/${username}/games/archives`);
    const archiveUrls = archivesResponse.data.archives;

    // Loop through each archive URL to fetch and save the games
    for (const url of archiveUrls) {
      const gamesResponse = await axios.get(url);
      const gamesData = gamesResponse.data.games;

      // Delegate to the import service to process and save the games
      await importGamesData(gamesData);
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
    // Fetch the games stream from Lichess
    const gamesResponse = await axios.get(`https://lichess.org/api/games/user/${username}?moves=true`, {
      responseType: 'stream',
    });

    let gamesData = '';
    gamesResponse.data.on('data', (chunk) => {
      gamesData += chunk.toString();
    });

    gamesResponse.data.on('end', async () => {
      // Split the NDJSON data and process each game
      const games = gamesData.split('\n').filter(Boolean).map(line => JSON.parse(line));

      // Delegate to the import service to process and save the games
      await importGamesData(games);

      res.status(200).json({ message: 'Lichess games imported successfully' });
    });

  } catch (error) {
    console.error('Error importing Lichess games:', error);
    res.status(500).json({ error: 'Failed to import Lichess games' });
  }
}

module.exports = { importChesscomGames, importLichessGames };
