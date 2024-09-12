import { Puzzle, IPuzzle, PlayerData, IUser } from 'endchess-models';

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
