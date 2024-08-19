"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gameSchema = new mongoose_1.default.Schema({
    ImportFrom: { type: String },
    GameId: { type: String, required: true },
    WhitePlayer: { type: String, required: true },
    BlackPlayer: { type: String, required: true },
    Result: { type: String, required: true },
    Date: { type: String, required: true },
    Opening: { type: String },
    Moves: { type: String, required: true },
    PGN: { type: String, required: true },
    WhiteElo: { type: String },
    BlackElo: { type: String },
    WhiteRatingDiff: { type: String },
    BlackRatingDiff: { type: String },
    ECO: { type: String },
    TimeControl: { type: String },
    Termination: { type: String }
});
const Game = mongoose_1.default.model('Game', gameSchema);
exports.default = Game;
