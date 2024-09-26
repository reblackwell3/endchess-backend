// src/features/puzzle/puzzleRepo.ts
import { MoveFeedbackDto } from 'endchess-api-settings';
import {
  Puzzle,
  IPuzzle,
  PlayerData,
  IPlayerData,
  IUser,
  ItemEvent,
} from 'endchess-models';

class PuzzleRepo {
  async findPlayerPuzzlesData(user: IUser): Promise<IPlayerData | null> {
    return await PlayerData.findOne({
      providerId: user.providerId,
      feature: 'puzzles',
    })
      .populate({
        path: 'itemEvents',
        match: { eventType: 'solved' },
      })
      .exec();
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

  async saveFeedback(
    user: IUser,
    puzzleId: string,
    feedback: MoveFeedbackDto,
  ): Promise<void> {
    const itemEvent = await ItemEvent.create({
      itemId: puzzleId,
      eventType: 'feedback',
      event: JSON.stringify(feedback),
    });
    const savedItemEvent = await itemEvent.save();

    await PlayerData.updateOne(
      { providerId: user.providerId, feature: 'puzzles' },
      {
        $push: {
          itemEvents: savedItemEvent._id,
        },
      },
    );
  }
}

export default new PuzzleRepo();
