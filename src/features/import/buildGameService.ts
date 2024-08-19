import Game, { IGame } from '../games/gameModel';

// ChessComGameData represents the structure of a game returned by Chess.com API
interface ChessComGameData {
    white: {
        username: string;
        result: string;
        rating: number;
        ratingDiff?: number;
    };
    black: {
        username: string;
        result: string;
        rating: number;
        ratingDiff?: number;
    };
    end_time: number;
    opening?: {
        name: string;
        eco: string;
    };
    pgn: string;
    time_control: string;
    termination: string;
}

// LichessGameData represents the structure of a game returned by Lichess API
interface LichessGameData {
    players: {
        white: {
            user: {
                name: string;
            };
            rating: number;
        };
        black: {
            user: {
                name: string;
            };
            rating: number;
        };
    };
    createdAt: number;
    winner?: string;
    opening?: {
        name: string;
        code: string;
    };
    moves: string;
    pgn: string;
    clock: {
        initial: number;
        increment: number;
    };
    status: string;
}

// PgnGameData represents the structure of a parsed PGN game
interface PgnGameData {
    headers: {
        White: string;
        Black: string;
        Result: string;
        UTCDate: string;
        Opening?: string;
        WhiteElo: string;
        BlackElo: string;
        WhiteRatingDiff?: string;
        BlackRatingDiff?: string;
        ECO?: string;
        TimeControl?: string;
        Termination?: string;
    };
    moves: { move: string }[];
    raw: string;
}

type GameData = ChessComGameData | LichessGameData | PgnGameData;

function buildGame(gameData: GameData, source: string): IGame | null {
    try {
        console.log('Building game from data:', JSON.stringify(gameData, null, 2));

        let game;

        if (source === 'Chess.com') {
            const chessComGameData = gameData as ChessComGameData;
            game = new Game({
                GameId: `game_${chessComGameData.white.username}_${chessComGameData.black.username}_${new Date(chessComGameData.end_time * 1000).toISOString().split('T')[0]}`,
                WhitePlayer: chessComGameData.white.username || '',
                BlackPlayer: chessComGameData.black.username || '',
                Result: chessComGameData.white.result === 'win' ? '1-0' : chessComGameData.black.result === 'win' ? '0-1' : '1/2-1/2',
                Date: new Date(chessComGameData.end_time * 1000).toISOString().split('T')[0],
                Opening: chessComGameData.opening ? chessComGameData.opening.name : 'Unknown',
                Moves: chessComGameData.pgn || '',
                PGN: chessComGameData.pgn || '',
                WhiteElo: chessComGameData.white.rating || 0,
                BlackElo: chessComGameData.black.rating || 0,
                WhiteRatingDiff: chessComGameData.white.ratingDiff || 0,
                BlackRatingDiff: chessComGameData.black.ratingDiff || 0,
                ECO: chessComGameData.opening?.eco || 'Unknown',
                TimeControl: chessComGameData.time_control || '',
                Termination: chessComGameData.termination || '',
                ImportFrom: 'Chess.com'
            });
        } else if (source === 'Lichess') {
            const lichessGameData = gameData as LichessGameData;
            game = new Game({
                GameId: `game_${lichessGameData.players.white.user.name}_${lichessGameData.players.black.user.name}_${new Date(lichessGameData.createdAt).toISOString().split('T')[0]}`,
                WhitePlayer: lichessGameData.players.white.user.name || '',
                BlackPlayer: lichessGameData.players.black.user.name || '',
                Result: lichessGameData.winner === 'white' ? '1-0' : lichessGameData.winner === 'black' ? '0-1' : '1/2-1/2',
                Date: new Date(lichessGameData.createdAt).toISOString().split('T')[0],
                Opening: lichessGameData.opening?.name || 'Unknown',
                Moves: lichessGameData.moves || '',
                PGN: lichessGameData.pgn || '',
                WhiteElo: lichessGameData.players.white.rating || 0,
                BlackElo: lichessGameData.players.black.rating || 0,
                ECO: lichessGameData.opening?.code || 'Unknown',
                TimeControl: `${lichessGameData.clock.initial}+${lichessGameData.clock.increment}` || '',
                Termination: lichessGameData.status || '',
                ImportFrom: 'Lichess'
            });
        } else if (source === 'Pgn') {
            const pgnGameData = gameData as PgnGameData;
            const headers = pgnGameData.headers;

            game = new Game({
                GameId: `game_${headers.White}_${headers.Black}_${headers.UTCDate}`,
                WhitePlayer: headers.White || '',
                BlackPlayer: headers.Black || '',
                Result: headers.Result || '',
                Date: headers.UTCDate || '',
                Opening: headers.Opening || '',
                Moves: pgnGameData.moves.map(move => move.move).join(' ') || '',
                PGN: pgnGameData.raw || '',
                WhiteElo: parseInt(headers.WhiteElo) || 0,
                BlackElo: parseInt(headers.BlackElo) || 0,
                WhiteRatingDiff: parseInt(headers.WhiteRatingDiff || '0'),
                BlackRatingDiff: parseInt(headers.BlackRatingDiff || '0'),                
                ECO: headers.ECO || '',
                TimeControl: headers.TimeControl || '',
                Termination: headers.Termination || '',
                ImportFrom: 'Pgn'
            });
        }

        console.log('game :', JSON.stringify(game, null, 2));
        return game ? game : null;
    } catch (error) {
        console.error('Failed to build game:', error);
    }
    return null;
}

export default buildGame;
