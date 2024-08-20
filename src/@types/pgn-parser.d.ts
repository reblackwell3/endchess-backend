declare module 'pgn-parser' {
    export interface PgnHeader {
        name: string;
        value: string;
    }

    export interface ParsedMove {
        move: string;
        // Add other properties if needed, such as move number, annotations, etc.
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
    
    export function parse(pgn: string): ParsedPgn[];
}
