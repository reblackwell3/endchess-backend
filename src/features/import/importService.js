const Game = require('../games/gameModel');
const parsePgn = require('./parsePgn');

// Original importGames function that is used elsewhere
async function importGames(path) {
    try {
        const parsedPgns = await parsePgn(path);
        const games = parsedPgns.map(parsedPgn => buildGame(parsedPgn));
        console.log(`${games.length} games have been built`);
        await Promise.all(games.filter(game => game && game.Moves !== '').map(game => game.save()));
        console.log('PGN file successfully processed and data imported');
    } catch (err) {
        console.error(`Error importing games: ${err.message}`);
    }
}

async function importGamesChessCom(gamesData) {
    try {
        const games = gamesData.map(g => {
            const parsedPgn = {
                headers: {
                    White: g.white.username,
                    Black: g.black.username,
                    Result: g.white.result === 'win' ? '1-0' : g.black.result === 'win' ? '0-1' : '1/2-1/2',
                    UTCDate: new Date(g.end_time * 1000).toISOString().split('T')[0], // Convert end_time to a readable date
                    Opening: g.opening ? g.opening.name : 'Unknown', // Handle cases where opening may not exist
                    WhiteElo: g.white.rating,
                    BlackElo: g.black.rating,
                    ECO: g.opening ? g.opening.eco : 'Unknown', // Handle cases where ECO may not exist
                    TimeControl: g.time_control,
                    Termination: g.termination,
                },
                moves: g.pgn.split(' ').map(move => ({ move })),
                raw: g.pgn,
            };
            return {...buildGame(parsedPgn), ImportFrom: 'Chess.com'};
        });

        console.log(`${games.length} games have been built`);
        await Promise.all(games.filter(game => game && game.Moves !== '').map(game => game.save()));
        console.log('Chess.com games successfully processed and data imported');
    } catch (err) {
        console.error(`Error importing Chess.com games: ${err.message}`);
    }
}


// New function to import games from Lichess data
async function importGamesLichess(gamesData) {
    try {
        const games = gamesData.map(g => {
            const parsedPgn = {
                headers: {
                    White: g.players.white.user.name,
                    Black: g.players.black.user.name,
                    Result: g.winner,
                    UTCDate: new Date(g.createdAt * 1000).toISOString().split('T')[0], // Convert timestamp to date
                    Opening: g.opening.name,
                    WhiteElo: g.players.white.rating,
                    BlackElo: g.players.black.rating,
                    ECO: g.opening.code,
                    TimeControl: g.clock.initial + '+' + g.clock.increment,
                    Termination: g.status,
                },
                moves: g.moves.split(' ').map(move => ({ move })),
                raw: g.pgn,
            };
            return {...buildGame(parsedPgn), ImportFrom: 'Lichess'};
        });

        console.log(`${games.length} games have been built`);
        await Promise.all(games.filter(game => game && game.Moves !== '').map(game => game.save()));
        console.log('Lichess games successfully processed and data imported');
    } catch (err) {
        console.error(`Error importing Lichess games: ${err.message}`);
    }
}

function buildGame(parsedPgn) {
    try {
        console.log('Parsed PGN Data:', JSON.stringify(parsedPgn, null, 2));

        const headers = parsedPgn.headers;

        const game = new Game({
            GameId: `game_${headers.White}_${headers.Black}_${headers.UTCDate}`,
            WhitePlayer: headers.White || '',
            BlackPlayer: headers.Black || '',
            Result: headers.Result || '',
            Date: headers.UTCDate || '',
            Opening: headers.Opening || '',
            Moves: parsedPgn.moves.map(move => move.move).join(' ') || '',
            PGN: parsedPgn.raw || '',
            WhiteElo: headers.WhiteElo || '',
            BlackElo: headers.BlackElo || '',
            WhiteRatingDiff: headers.WhiteRatingDiff || '',
            BlackRatingDiff: headers.BlackRatingDiff || '',
            ECO: headers.ECO || '',
            TimeControl: headers.TimeControl || '',
            Termination: headers.Termination || ''
        });

        console.log('game :', JSON.stringify(game, null, 2));
        return game;
    } catch (error) {
        console.error('Failed to build game:', error);
    }
    return null;
}

module.exports = { importGames, importGamesChessCom, importGamesLichess };
