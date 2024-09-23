// src/features/puzzle/puzzleRepo.ts
import { IMoveFeedback } from 'endchess-api-settings';
import {
  Puzzle,
  IPuzzle,
  PlayerData,
  IPlayerData,
  IUser,
} from 'endchess-models';

class PuzzleRepo {
  async findPlayerPuzzlesData(user: IUser): Promise<IPlayerData | null> {
    return await PlayerData.findOne({
      providerId: user.providerId,
      feature: 'puzzles',
    });
  }

  async findUnsolvedPuzzle(
    solvedIds: string[],
    ratingRange: { min: number; max: number },
  ): Promise<IPuzzle | null> {
    return await Puzzle.findOne({
      _id: { $nin: solvedIds },
      rating: { $gte: ratingRange.min, $lte: ratingRange.max },
    });
  }

  async findSolvedPuzzle(
    solvedIds: string[],
    ratingRange: { min: number; max: number },
  ): Promise<IPuzzle | null> {
    return await Puzzle.findOne({
      _id: { $in: solvedIds },
      rating: { $gte: ratingRange.min, $lte: ratingRange.max },
    });
  }

  async findAnyPuzzle(ratingRange: {
    min: number;
    max: number;
  }): Promise<IPuzzle | null> {
    return await Puzzle.findOne({
      rating: { $gte: ratingRange.min, $lte: ratingRange.max },
    });
  }

  async saveFeedback(user: IUser, feedback: IMoveFeedback): Promise<void> {
    const playerData = await this.findPlayerPuzzlesData(user);
    if (playerData) {
      playerData.itemEvents.push({
        itemId: feedback.index.toString(),
        eventType: 'feedback',
        event: JSON.stringify(feedback),
      });
      await playerData.save();
    }
  }
}

export default new PuzzleRepo();
