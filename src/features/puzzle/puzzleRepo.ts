// src/features/puzzle/puzzleRepo.ts
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
}

export default new PuzzleRepo();
