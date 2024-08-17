import mongoose from 'mongoose';
import { importGames } from '../../src/features/games/importGames.js';
import Game from '../../src/features/games/gameModel.js';
import connectDB from '../../src/config/db.js';
import { expect } from 'chai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.test' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Import Games', () => {
  before(async () => {
    try {
      await connectDB();
      await Game.deleteMany({});
      console.log('Cleared existing game data');
    } catch (err) {
      console.error('Error in before hook:', err.message);
      throw err;
    }
  });

  it('should import 554 games from small.pgn', async () => {
    try {
      const pgnPath = path.resolve(__dirname, '../data/small.pgn');
      // Import games from small.pgn
      await importGames(pgnPath);

      // Count the number of records in the games collection
      const gameCount = await Game.countDocuments();

      // Assert that there are 555 records
      expect(gameCount).to.equal(554);

      console.log(`Test passed: There are ${gameCount} records in the games collection.`);
    } catch (err) {
      console.error(`Test failed: ${err.message}`);
      throw err; // Re-throw the error to ensure the test fails
    }
  });
});
