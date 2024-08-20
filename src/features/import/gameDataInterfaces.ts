export interface ChessComGameData {
    white: { username: string; result: string; rating: number; ratingDiff?: number };
    black: { username: string; result: string; rating: number; ratingDiff?: number };
    end_time: number;
    opening?: { name: string; eco: string };
    pgn: string;
    time_control: string;
    termination: string;
}

export interface LichessGameData {
    players: {
        white: { user: { name: string }; rating: number };
        black: { user: { name: string }; rating: number };
    };
    createdAt: number;
    winner?: string;
    opening?: { name: string; code: string };
    moves: string;
    pgn: string;
    clock: { initial: number; increment: number };
    status: string;
}

export interface PgnGameData {
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

export type GameData = ChessComGameData | LichessGameData | PgnGameData;
