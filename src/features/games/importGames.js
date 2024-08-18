const mongoose = require('mongoose');
const { parsePgn } = require('./parsePgn');
const Game = require('./gameModel');
const connectDB = require('../../config/db');
const {importGames} = require('../import/importService');

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

