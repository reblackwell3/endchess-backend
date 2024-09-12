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
