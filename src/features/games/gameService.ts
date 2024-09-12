import { Game } from 'endchess-models';

const findRandomGame = async () => {
  const count = await Game.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  const game = await Game.findOne().skip(randomIndex);
};

export { findRandomGame };
