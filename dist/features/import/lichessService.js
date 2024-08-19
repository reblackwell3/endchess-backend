"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readGamesFromLichess = readGamesFromLichess;
const axios_1 = __importDefault(require("axios")); // For making HTTP requests
const buildGameService_1 = __importDefault(require("./buildGameService")); // Service to build game objects
const parsePgn_1 = __importDefault(require("./parsePgn")); // Assuming you have a function to parse PGN data
// Function to import games from Lichess data
async function importGamesLichess(gamesData) {
    try {
        const games = gamesData.map(g => (0, buildGameService_1.default)(g, 'Lichess'));
        console.log(`${games.length} games have been built`);
        await Promise.all(games.filter(game => game && game.Moves !== '').map(game => game.save()));
        console.log('Lichess games successfully processed and data imported');
    }
    catch (err) {
        const error = err;
        console.error(`Error importing Lichess games: ${error.message}`);
    }
}
// Function to read games from Lichess
async function readGamesFromLichess(username) {
    try {
        const MAX_10_GAMES_FOR_TESTING = 10;
        // Fetch the PGN file from Lichess API with evals included
        const response = await axios_1.default.get(`https://lichess.org/api/games/user/${username}`, {
            headers: {
                'Accept': 'application/x-chess-pgn'
            },
            params: {
                evals: true, // Include evaluations (evals) in the PGN
                opening: true, // Include opening names
                moves: true, // Include moves in the PGN
                max: MAX_10_GAMES_FOR_TESTING, // Optionally limit the number of games fetched
            },
            responseType: 'text' // Make sure to get the response as text since it's a PGN file
        });
        const pgnText = response.data;
        console.log(`pgnText: ${pgnText}`);
        // Parse the PGN data (assuming parsePgn function exists)
        const gamesData = (0, parsePgn_1.default)(pgnText);
        // Process and save the games
        await importGamesLichess(gamesData);
        console.log('Lichess games successfully processed and data imported');
    }
    catch (err) {
        const error = err;
        console.error(`Error importing Lichess games: ${error.message}`);
        console.error(error.stack);
        throw new Error('Failed to import Lichess games');
    }
}
