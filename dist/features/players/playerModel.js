"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/players/playerModel.js
const mongoose_1 = __importDefault(require("mongoose"));
const playerSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true, unique: true },
    elo: { type: Number, required: true, default: 1200 },
    puzzlesCompleted: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Puzzle' }],
    gamesCompleted: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Game' }]
});
const Player = mongoose_1.default.model('Player', playerSchema);
exports.default = Player;
