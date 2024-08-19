"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readGamesFromLichess = readGamesFromLichess;
const axios_1 = __importDefault(require("axios"));
const buildGameService_1 = __importDefault(require("./buildGameService"));
const parsePgn_1 = __importDefault(require("./parsePgn"));
async function importGamesLichess(gamesData) {
    try {
        const games = gamesData
            .map(g => (0, buildGameService_1.default)(g, 'Lichess'))
            .filter((game) => game !== null);
        console.log(`${games.length} games have been built`);
        await Promise.all(games.map(game => game.save()));
        console.log('Lichess games successfully processed and data imported');
    }
    catch (err) {
        const error = err;
        console.error(`Error importing Lichess games: ${error.message}`);
    }
}
async function readGamesFromLichess(username) {
    try {
        const MAX_10_GAMES_FOR_TESTING = 10;
        const response = await axios_1.default.get(`https://lichess.org/api/games/user/${username}`, {
            headers: {
                'Accept': 'application/x-chess-pgn'
            },
            params: {
                evals: true,
                opening: true,
                moves: true,
                max: MAX_10_GAMES_FOR_TESTING,
            },
            responseType: 'text'
        });
        const pgnText = response.data;
        console.log(`pgnText: ${pgnText}`);
        const gamesData = (0, parsePgn_1.default)(pgnText)
            .map(parsed => (0, buildGameService_1.default)(parsed, 'Pgn'))
            .filter((game) => game !== null);
        await importGamesLichess(gamesData);
        console.log('Lichess games successfully processed and data imported');
    }
    catch (err) {
        const error = err;
        console.error(`Error importing Lichess games: ${error.message}`);
        throw new Error('Failed to import Lichess games');
    }
}
