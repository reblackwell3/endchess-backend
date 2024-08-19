const mongoose = require('mongoose');
const { parsePgn } = require('./parsePgn');
const Game = require('../games/gameModel');
const connectDB = require('../../config/db');
const buildGame = require('./buildGameService');

// Original importGames function that is used elsewhere
async function importGames(path) {
    try {
        const parsedPgns = await parsePgn(path);
        const games = parsedPgns.map(parsedPgn => buildGame(parsedPgn, 'Pgn'));
        console.log(`${games.length} games have been built`);
        await Promise.all(games.filter(game => game && game.Moves !== '').map(game => game.save()));
        console.log('PGN file successfully processed and data imported');
    } catch (err) {
        console.error(`Error importing games: ${err.message}`);
    }
}

// Load environment variables from .env file
require('dotenv').config();

// Connect to the database
connectDB();

// Get the filename from the command line arguments
const path = process.argv[2];

if (!path) {
  console.error('Please provide a file name as an argument');
  process.exit(1);
}

console.log('Beginning import of ' + path);

// Call importGames with the provided path
(async () => {
  await connectDB();
  await importGames(path);
  mongoose.connection.close();
})();

