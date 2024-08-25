import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import Puzzle from './puzzleModel';
import connectDB from '../../config/db';
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

        puzzles.push(puzzle); // Add puzzle to the array
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
