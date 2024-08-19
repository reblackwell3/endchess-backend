declare module 'pgn-parser' {
    export interface PgnHeader {
        name: string;
        value: string;
    }

    export interface ParsedMove {
        move: string;
        // Add other properties if needed, such as move number, annotations, etc.
    }

    export interface ParsedPgn {
        headers: PgnHeader[];
        moves: ParsedMove[]; // Assuming moves are stored in an array
    }

    export interface AugmentedParsedPgn extends ParsedPgn {
        raw: string;
    }

    export function parse(pgn: string): ParsedPgn[];
}
