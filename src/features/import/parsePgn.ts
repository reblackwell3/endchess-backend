import pgnParser from 'pgn-parser';

interface PgnHeader {
    name: string;
    value: string;
}

interface ParsedPgn {
    headers: PgnHeader[];
    moves: any[]; // Assuming moves are stored in an array; you can replace `any` with a specific type if known
    raw: string;
}

function parsePgn(pgnText: string): ParsedPgn[] {
    try {
        // Split the PGN text into individual game segments
        const pgns = pgnText.split(/\n\n(?=\[Event)/).filter(Boolean);

        // Parse each PGN and augment the parsed data
        const parsedPgns = pgns.map(pgn => augmentParsed(pgnParser.parse(pgn), pgn));

        return parsedPgns;
    } catch (error) {
        console.error('Error parsing PGN data:', error);
        throw error; // Throw the error to be handled by the calling function
    }
}

function augmentParsed(parsed: any[], rawPgn: string): ParsedPgn {
    const headers = parsed[0].headers.reduce((acc: Record<string, string>, header: PgnHeader) => {
        acc[header.name] = header.value;
        return acc;
    }, {});
    return { ...parsed[0], headers, raw: rawPgn };
}

export default parsePgn;
