import { Difficulty } from './settings';
import { Puzzle, PlayerData, IPuzzle, IUser } from 'endchess-models';

export const getAPuzzle = async (
  user: IUser,
  difficulty: Difficulty,
): Promise<IPuzzle> => {
  const playerData = await PlayerData.findOne({
    providerId: user.providerId,
    feature: 'puzzles',
  }).select('rating');
  const ratingRange = calculateRatingRange(playerData!.rating, difficulty);
  const puzzle = await findPuzzleInRange(ratingRange);
  return puzzle!;
};

const calculateRatingRange = (
  rating: number,
  difficulty: Difficulty,
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

const findPuzzleInRange = async (ratingRange: {
  min: number;
  max: number;
}): Promise<IPuzzle | null> => {
  const count = await Puzzle.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  const puzzle = await Puzzle.findOne().skip(randomIndex);
  return puzzle;
};
