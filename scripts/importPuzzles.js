"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const endchess_models_1 = __importDefault(require("endchess-models"));
const db_1 = require("../src/config/db");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
(0, db_1.connectDB)();
importPuzzles();
async function importPuzzles() {
    try {
        // Clear existing data
        await endchess_models_1.default.deleteMany({});
        console.log('Cleared existing puzzle data');
        // Read and parse the CSV file
        const puzzles = []; // Store puzzles to insert them at once
        fs_1.default.createReadStream('./__data__/lichess_db_puzzle.csv')
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            const puzzle = new endchess_models_1.default({
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
                await endchess_models_1.default.insertMany(puzzles); // Insert all puzzles at once
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
//# sourceMappingURL=importPuzzles.js.map