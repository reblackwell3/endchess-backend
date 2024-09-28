// backend/server.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { connectDB, closeDB } from '../../src/config/db';
import { closeSessionStore } from '../../src/config/session';
import { PlayerData, User, Puzzle } from 'endchess-models';
import { PuzzleSettings, PuzzleSettingsDto } from 'endchess-api-settings';
import { Types } from 'mongoose';
import puzzleJson from '../__mocks__/puzzle.json';
import cookieSignature from 'cookie-signature';
import mockDetails from '../__mocks__/mockFindOrCreateUserDetails';

import request from 'supertest';
import app from '../../src/app';

describe('Puzzle Integration Tests', () => {
  let signedCookie: string;
  beforeAll(async () => {
    await connectDB();
    await User.deleteOne({ providerId: mockDetails.profile.id }); // Clear the User collection before tests
    const user = await User.findOrCreate(
      mockDetails.profile,
      mockDetails.accessToken,
      mockDetails.refreshToken,
    ); // Create a mock user
    await PlayerData.deleteMany({
      providerId: mockDetails.profile.id,
      feature: 'puzzles',
    });
    await PlayerData.findOrCreatePopulated(mockDetails.profile.id, 'puzzles');
    const puzzleId = new Types.ObjectId(puzzleJson._id);
    await Puzzle.deleteOne({ _id: puzzleId });
    await Puzzle.create({
      ...puzzleJson,
      _id: puzzleId,
    });
    signedCookie = `s:${cookieSignature.sign(user!.accessToken, process.env.COOKIE_SECRET!)}`;
  });

  afterAll(async () => {
    await closeDB();
    await closeSessionStore();
  });

  it('should be able to get a random puzzle', async () => {
    const settings: PuzzleSettingsDto = {
      difficulties: [PuzzleSettings.Difficulty.MEDIUM],
      solvedStatuses: [PuzzleSettings.SolvedStatus.UNSOLVED],
    };
    const headers = {
      settings: JSON.stringify(settings),
      Cookie: `endchess-token=${signedCookie}`,
    };
    const res = await request(app).get('/puzzles').set(headers);
    expect(res.status).toBe(200);
  });

  it('should be able to post feedback', async () => {
    const incorrectGuess = {
      index: 1,
      guess: {
        sourceSquare: 'e2',
        targetSquare: 'e4',
        piece: 'P',
      },
      isCorrect: false,
    };
    const hintRequested = {
      index: 2,
      hintRequested: true,
    };
    const correctFinish = {
      index: 3,
      guess: {
        sourceSquare: 'd2',
        targetSquare: 'd4',
        piece: 'P',
      },
      isCorrect: true,
      isFinished: true,
    };
    for (const feedback of [incorrectGuess, hintRequested, correctFinish]) {
      const headers = {
        'Content-Type': 'application/json',
        Cookie: `endchess-token=${signedCookie}`,
      };
      const res = await request(app)
        .post(`/puzzles/feedback/${puzzleJson._id}`)
        .set(headers)
        .send(feedback);
      expect(res.status).toBe(200);
    }
    const resp = await PlayerData.findOne({
      providerId: mockDetails.profile.id,
      feature: 'puzzles',
    }).select('itemEvents');
    const itemEvents = resp!.itemEvents;
    expect(itemEvents.length).toBe(3);
  });
});
