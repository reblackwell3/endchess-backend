"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pgn_parser_1 = __importDefault(require("pgn-parser"));
function parsePgn(pgnText) {
    try {
        // Split the PGN text into individual game segments
        const pgns = pgnText.split(/\n\n(?=\[Event)/).filter(Boolean);
        // Parse each PGN and augment the parsed data
        const parsedPgns = pgns.map(pgn => augmentParsed(pgn_parser_1.default.parse(pgn), pgn));
        return parsedPgns;
    }
    catch (error) {
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
exports.default = parsePgn;
