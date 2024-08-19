"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gameSchema = new mongoose_1.Schema({
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
const Game = (0, mongoose_1.model)('Game', gameSchema);
exports.default = Game;
