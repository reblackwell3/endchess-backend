"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readGamesFromChessCom = readGamesFromChessCom;
const axios_1 = __importDefault(require("axios"));
const buildGameService_1 = __importDefault(require("./buildGameService"));
async function importGamesChessCom(gamesData) {
    try {
        const games = gamesData
            .map(g => (0, buildGameService_1.default)(g, 'Chess.com'))
            .filter((game) => game !== null);
        console.log(`${games.length} games have been built`);
        await Promise.all(games.map(game => game.save()));
        console.log('Chess.com games successfully processed and data imported');
    }
    catch (err) {
        const error = err;
        console.error(`Error importing Chess.com games: ${error.message}`);
    }
}
async function readGamesFromChessCom(username) {
    try {
        console.log('Fetching archives from Chess.com API');
        const archivesResponse = await axios_1.default.get(`https://api.chess.com/pub/player/${username}/games/archives`);
        const archiveUrls = archivesResponse.data.archives;
        for (const url of archiveUrls) {
            const gamesResponse = await axios_1.default.get(url);
            const gamesData = gamesResponse.data.games;
            console.log(gamesData);
            await importGamesChessCom(gamesData);
        }
        console.log('Chess.com games imported successfully');
    }
    catch (error) {
        console.error('Error importing Chess.com games:', error);
        throw new Error('Failed to import Chess.com games');
    }
}
