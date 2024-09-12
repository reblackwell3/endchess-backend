import { Game, IGame } from 'endchess-models';

const findOneGameRatedGreaterThan = async (
  rating: number,
): Promise<IGame | null> => {
  const ratedGreatherThan = {
    'white.rating': { $gt: rating },
    'black.rating': { $gt: rating },
  };
  const count = await Game.countDocuments(ratedGreatherThan);
  const randomIndex = Math.floor(Math.random() * count);
  const game = await Game.findOne(ratedGreatherThan).skip(randomIndex);
  return game;
};

const findOneRandomGame = async () => {
  const count = await Game.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  const game = await Game.findOne().skip(randomIndex);
};
