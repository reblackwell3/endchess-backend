"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pgn_parser_1 = __importDefault(require("pgn-parser"));
function parsePgn(pgnText) {
    try {
        const pgns = pgnText.split(/\n\n(?=\[Event)/).filter(Boolean);
        const parsedPgns = pgns.map(pgn => augmentParsed(pgn_parser_1.default.parse(pgn)[0], pgn));
        return parsedPgns;
    }
    catch (error) {
        console.error('Error parsing PGN data:', error);
        throw error;
    }
}
function augmentParsed(parsed, raw) {
    const headers = parsed.headers.map((header) => ({
        name: header.name,
        value: header.value
    }));
    return { ...parsed, headers, raw };
}
exports.default = parsePgn;
