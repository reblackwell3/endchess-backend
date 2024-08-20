// backend/server.js
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import puzzleRoutes from './features/puzzles/puzzleRoutes.js';
import playerRoutes from './features/players/playerRoutes.js';
import gameRoutes from './features/games/gameRoutes.js';
import importRoutes from './features/import/importRoutes.js';

dotenv.config({ path: '.env' });

const app = express();
app.use(cors());

connectDB();

app.use(express.json());

app.use('/api/puzzles', puzzleRoutes);

app.use('/api/players', playerRoutes);

app.use('/api/games', gameRoutes);

app.use('/api/import', importRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
