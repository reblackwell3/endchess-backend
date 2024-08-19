import pgnParser, { AugmentedParsedPgn, ParsedPgn } from 'pgn-parser';

interface PgnHeader {
    name: string;
    value: string;
}

function parsePgn(pgnText: string): ParsedPgn[] {
    try {
        const pgns = pgnText.split(/\n\n(?=\[Event)/).filter(Boolean);

        const parsedPgns = pgns.map(pgn => augmentParsed(pgnParser.parse(pgn)[0], pgn));

        return parsedPgns;
    } catch (error) {
        console.error('Error parsing PGN data:', error);
        throw error;
    }
}

function augmentParsed(parsed: ParsedPgn, raw: string): AugmentedParsedPgn {
    const headers: PgnHeader[] = parsed.headers.map((header: PgnHeader) => ({
        name: header.name,
        value: header.value
    }));

    return { ...parsed, headers, raw };
}


export default parsePgn;
