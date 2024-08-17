// backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const puzzleRoutes = require('./features/puzzles/puzzleRoutes');
const playerRoutes = require('./features/players/playerRoutes');
const gameRoutes = require('./features/games/gameRoutes');

dotenv.config({ path: '.env' });

const app = express();
app.use(cors())

connectDB();

app.use(express.json());

app.use('/api/puzzles', puzzleRoutes);

app.use('/api/players', playerRoutes);

app.use('/api/games', gameRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
