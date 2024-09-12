import { PuzzleSettings } from 'endchess-api-settings'
import { Puzzle, IPuzzle, PlayerData, IUser } from 'endchess-models';

export const calculateRatingRange = (
  rating: number,
  difficulty: ,
): { min: number; max: number } => {
  const LEVEL_ADJUSTMENT = 300;
  let target: number;
  switch (difficulty) {
    case Difficulty.EASY:
      target = rating - LEVEL_ADJUSTMENT;
      break;
    case Difficulty.MEDIUM:
      target = rating;
      break;
    case Difficulty.HARD:
      target = rating + LEVEL_ADJUSTMENT;
      break;
    default:
      throw new Error('Invalid difficulty');
  }

  return {
    min: target - LEVEL_ADJUSTMENT / 2,
    max: target + LEVEL_ADJUSTMENT / 2,
  };
};

export const findPuzzle = async (
  user: IUser,
  ratingRange: { min: number; max: number },
): Promise<IPuzzle | null> => {
  const playerPuzzlesData = await PlayerData.findOne({
    providerId: user.providerId,
    feature: 'puzzles',
  });
  const solvedPuzzleIds = playerPuzzlesData?.itemEvents
    .filter((itemEvent) => itemEvent.event === 'solved')
    .map((itemEvent) => itemEvent.itemId);
  const puzzle = await findUnsolvedPuzzle(solvedPuzzleIds || [], ratingRange);
  return puzzle;
};

const findUnsolvedPuzzle = async (
  solvedIds: string[],
  ratingRange: {
    min: number;
    max: number;
  },
): Promise<IPuzzle | null> => {
  const puzzle = await Puzzle.findOne({
    _id: { $nin: solvedIds },
    rating: { $gte: ratingRange.min, $lte: ratingRange.max },
  });
  return puzzle;
};
