// backend/puzzles/importPuzzles.js
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Puzzle = require('./puzzleModel');
const connectDB = require('../config/db')

// Load environment variables from .env file
require('dotenv').config();

connectDB();
importPuzzles();

async function importPuzzles() {
  try {
    // Clear existing data
    await Puzzle.deleteMany({});
    console.log('Cleared existing puzzle data');

    // Read and parse the CSV file
    fs.createReadStream('./data/lichess_db_puzzle.csv')
      .pipe(csv())
      .on('data', async (row) => {
        const puzzle = new Puzzle({
          PuzzleId: row.PuzzleId,
          FEN: row.FEN,
          Moves: row.Moves,
          Rating: row.Rating,
          RatingDeviation: row.RatingDeviation,
          Popularity: row.Popularity,
          NbPlays: row.NbPlays,
          Themes: row.Themes,
          GameUrl: row.GameUrl,
          OpeningTags: row.OpeningTags,
        });

        // Save puzzle to database
        await puzzle.save();

      })
      .on('end', () => {
        console.log('CSV file successfully processed and data imported');
      });
  } catch (err) {
    console.error(`Error importing puzzles: ${err.message}`);
  }
}
