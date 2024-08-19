"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameModel_1 = __importDefault(require("../games/gameModel"));
function buildGame(gameData, source) {
    try {
        console.log('Building game from data:', JSON.stringify(gameData, null, 2));
        let game;
        if (source === 'Chess.com') {
            const chessComGameData = gameData;
            game = new gameModel_1.default({
                GameId: `game_${chessComGameData.white.username}_${chessComGameData.black.username}_${new Date(chessComGameData.end_time * 1000).toISOString().split('T')[0]}`,
                WhitePlayer: chessComGameData.white.username || '',
                BlackPlayer: chessComGameData.black.username || '',
                Result: chessComGameData.white.result === 'win' ? '1-0' : chessComGameData.black.result === 'win' ? '0-1' : '1/2-1/2',
                Date: new Date(chessComGameData.end_time * 1000).toISOString().split('T')[0],
                Opening: chessComGameData.opening ? chessComGameData.opening.name : 'Unknown',
                Moves: chessComGameData.pgn.split(' ').map(move => move).join(' ') || '',
                PGN: chessComGameData.pgn || '',
                WhiteElo: chessComGameData.white.rating || '',
                BlackElo: chessComGameData.black.rating || '',
                WhiteRatingDiff: chessComGameData.white.ratingDiff || '',
                BlackRatingDiff: chessComGameData.black.ratingDiff || '',
                ECO: chessComGameData.opening ? chessComGameData.opening.eco : 'Unknown',
                TimeControl: chessComGameData.time_control || '',
                Termination: chessComGameData.termination || '',
                ImportFrom: 'Chess.com'
            });
        }
        else if (source === 'Lichess') {
            const lichessGameData = gameData;
            game = new gameModel_1.default({
                GameId: `game_${lichessGameData.players.white.user.name}_${lichessGameData.players.black.user.name}_${new Date(lichessGameData.createdAt).toISOString().split('T')[0]}`,
                WhitePlayer: lichessGameData.players.white.user.name || '',
                BlackPlayer: lichessGameData.players.black.user.name || '',
                Result: lichessGameData.winner === 'white' ? '1-0' : lichessGameData.winner === 'black' ? '0-1' : '1/2-1/2',
                Date: new Date(lichessGameData.createdAt).toISOString().split('T')[0],
                Opening: lichessGameData.opening ? lichessGameData.opening.name : 'Unknown',
                Moves: lichessGameData.moves.split(' ').map(move => move).join(' ') || '',
                PGN: lichessGameData.pgn || '',
                WhiteElo: lichessGameData.players.white.rating || '',
                BlackElo: lichessGameData.players.black.rating || '',
                WhiteRatingDiff: '', // Lichess data might not provide ratingDiff
                BlackRatingDiff: '', // Lichess data might not provide ratingDiff
                ECO: lichessGameData.opening ? lichessGameData.opening.code : 'Unknown',
                TimeControl: `${lichessGameData.clock.initial}+${lichessGameData.clock.increment}` || '',
                Termination: lichessGameData.status || '',
                ImportFrom: 'Lichess'
            });
        }
        else if (source === 'Pgn') {
            const pgnGameData = gameData;
            const headers = pgnGameData.headers;
            game = new gameModel_1.default({
                GameId: `game_${headers.White}_${headers.Black}_${headers.UTCDate}`,
                WhitePlayer: headers.White || '',
                BlackPlayer: headers.Black || '',
                Result: headers.Result || '',
                Date: headers.UTCDate || '',
                Opening: headers.Opening || '',
                Moves: pgnGameData.moves.map(move => move.move).join(' ') || '',
                PGN: pgnGameData.raw || '',
                WhiteElo: headers.WhiteElo || '',
                BlackElo: headers.BlackElo || '',
                WhiteRatingDiff: headers.WhiteRatingDiff || '',
                BlackRatingDiff: headers.BlackRatingDiff || '',
                ECO: headers.ECO || '',
                TimeControl: headers.TimeControl || '',
                Termination: headers.Termination || '',
                ImportFrom: 'Pgn'
            });
        }
        console.log('game :', JSON.stringify(game, null, 2));
        return game;
    }
    catch (error) {
        console.error('Failed to build game:', error);
    }
    return null;
}
exports.default = buildGame;
