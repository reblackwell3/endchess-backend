import Game, { IGame } from '../games/gameModel';
import User from '../user/userModel'; // Assuming this is the User model
import mongoose, { Types } from 'mongoose';

export type SaveFeedback = {
  inserts?: Types.ObjectId[];
  duplicates?: Types.ObjectId[];
};

export async function saveGames(
  games: IGame[],
  providerId: string,
  source: string,
): Promise<SaveFeedback> {
  const savedGameIds: Types.ObjectId[] = [];
  const duplicateGameIds: Types.ObjectId[] = [];

  for (const game of games) {
    const savedGameId = await saveGame(game, source);
    if (savedGameId) {
      savedGameIds.push(savedGameId);
    } else {
      duplicateGameIds.push(game._id);
    }
  }

  if (savedGameIds.length > 0) {
    await updateUserImportedGames(providerId, savedGameIds);
  }

  console.log(`${savedGameIds.length} games have been saved from ${source}.`);
  return { inserts: savedGameIds, duplicates: duplicateGameIds };
}

async function saveGame(
  game: IGame,
  source: string,
): Promise<Types.ObjectId | null> {
  try {
    if (await isDuplicateGame(game, source)) {
      console.log(`Game with UUID ${game.uuid} already exists, skipping...`);
      return null;
    }

    const newGame = new Game(game);
    newGame.import_from = source;

    const savedGame = await newGame.save();
    return savedGame._id;
  } catch (error) {
    const err = error as Error;
    console.error(`Error saving game: ${err.message}`);
    return null;
  }
}

async function isDuplicateGame(game: IGame, source: string): Promise<boolean> {
  return !!(await Game.findOne({ import_from: source, uuid: game.uuid }));
}

async function updateUserImportedGames(
  providerId: string,
  gameIds: mongoose.Types.ObjectId[],
): Promise<void> {
  await User.findOneAndUpdate(
    { providerId: providerId },
    { $push: { 'player.importedGames': { $each: gameIds } } },
  );
}
