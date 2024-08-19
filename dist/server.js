"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/server.js
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const puzzleRoutes_1 = __importDefault(require("./features/puzzles/puzzleRoutes"));
const playerRoutes_1 = __importDefault(require("./features/players/playerRoutes"));
const gameRoutes_1 = __importDefault(require("./features/games/gameRoutes"));
const importRoutes_1 = __importDefault(require("./features/import/importRoutes"));
dotenv_1.default.config({ path: '.env' });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
(0, db_1.default)();
app.use(express_1.default.json());
app.use('/api/puzzles', puzzleRoutes_1.default);
app.use('/api/players', playerRoutes_1.default);
app.use('/api/games', gameRoutes_1.default);
app.use('/api/import', importRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
