import pgnParser from 'pgn-parser';
import { PgnGameData } from './gameDataInterfaces';

interface PgnHeader {
    name: string;
    value: string;
}

function parsePgn(pgnText: string): PgnGameData[] {
    try {
        const pgns = pgnText.split(/\n\n(?=\[Event)/).filter(Boolean);

        const parsedPgns = pgns.map(pgn => createPgnGameData(pgnParser.parse(pgn)[0], pgn));

        return parsedPgns;
    } catch (error) {
        console.error('Error parsing PGN data:', error);
        throw error;
    }
}

function createPgnGameData(parsed: any, raw: string): PgnGameData {
    const headers = parsed.headers.reduce((acc: any, header: any) => {
        acc[header.name] = header.value;
        return acc;
    }, {});

    return {
        headers: {
            White: headers['White'] || '',
            Black: headers['Black'] || '',
            Result: headers['Result'] || '',
            UTCDate: headers['UTCDate'] || '',
            Opening: headers['Opening'],
            WhiteElo: headers['WhiteElo'] || '',
            BlackElo: headers['BlackElo'] || '',
            WhiteRatingDiff: headers['WhiteRatingDiff'],
            BlackRatingDiff: headers['BlackRatingDiff'],
            ECO: headers['ECO'],
            TimeControl: headers['TimeControl'],
            Termination: headers['Termination'],
        },
        moves: parsed.moves.map((move: any) => ({ move: move.move })),
        raw: raw,
    };
}

export default parsePgn;