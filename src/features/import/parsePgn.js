const pgnParser = require('pgn-parser');

function parsePgn(pgnText) {
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

function augmentParsed(parsed, rawPgn) {
    const headers = parsed[0].headers.reduce((acc, header) => {
        acc[header.name] = header.value;
        return acc;
    }, {});
    return { ...parsed[0], headers, raw: rawPgn };
}

module.exports = { parsePgn };
