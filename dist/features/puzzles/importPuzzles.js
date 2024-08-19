"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const puzzleModel_1 = __importDefault(require("./puzzleModel"));
const db_1 = __importDefault(require("../../config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
(0, db_1.default)();
importPuzzles();
async function importPuzzles() {
    try {
        // Clear existing data
        await puzzleModel_1.default.deleteMany({});
        console.log('Cleared existing puzzle data');
        // Read and parse the CSV file
        const puzzles = []; // Store puzzles to insert them at once
        fs_1.default.createReadStream('./data/lichess_db_puzzle.csv')
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            const puzzle = new puzzleModel_1.default({
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
                await puzzleModel_1.default.insertMany(puzzles); // Insert all puzzles at once
                console.log('CSV file successfully processed and data imported');
            }
            catch (err) {
                if (err instanceof Error) {
                    console.error(`Error inserting puzzles: ${err.message}`);
                }
                else {
                    console.error('An unknown error occurred while inserting puzzles');
                }
            }
            finally {
                mongoose_1.default.connection.close(); // Close the connection when done
            }
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(`Error importing puzzles: ${err.message}`);
        }
        else {
            console.error('An unknown error occurred while importing puzzles');
        }
    }
}
