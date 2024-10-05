import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import { Puzzle } from 'endchess-models';
import { connectDB } from '../src/config/db';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

connectDB();
importPuzzles();

async function importPuzzles(): Promise<void> {
  try {
    // Clear existing data
    await Puzzle.deleteMany({});
    console.log('Cleared existing puzzle data');

    // Read and parse the CSV file
    const puzzles: any[] = []; // Store puzzles to insert them at once

    fs.createReadStream('./__data__/lichess_db_puzzle.csv')
      .pipe(csv())
      .on('data', (row) => {
        const puzzle = new Puzzle({
          puzzleId: row.PuzzleId,
          fen: row.FEN,
          moves: row.Moves.split(' '),
          rating: row.Rating,
          ratingDeviation: row.RatingDeviation,
          popularity: row.Popularity,
          nbPlays: row.NbPlays,
          themes: row.Themes,
          gameUrl: row.GameUrl,
          openingTags: row.OpeningTags,
        });

        puzzles.push(puzzle);
      })
      .on('end', async () => {
        try {
          await Puzzle.insertMany(puzzles); // Insert all puzzles at once
          console.log('CSV file successfully processed and data imported');
        } catch (err) {
          if (err instanceof Error) {
            console.error(`Error inserting puzzles: ${err.message}`);
          } else {
            console.error('An unknown error occurred while inserting puzzles');
          }
        } finally {
          mongoose.connection.close(); // Close the connection when done
        }
      });
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error importing puzzles: ${err.message}`);
    } else {
      console.error('An unknown error occurred while importing puzzles');
    }
  }
}
