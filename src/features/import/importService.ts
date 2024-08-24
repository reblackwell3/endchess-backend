import Game, { IGame } from '../games/gameModel';
import Player from '../players/playerModel'; // Assuming this is the Player model
import mongoose, { Types } from 'mongoose';

export async function saveGames(
  games: IGame[],
  endchess_username: string,
  source: string,
): Promise<void> {
  const savedGameIds: Types.ObjectId[] = [];

  for (const game of games) {
    const savedGameId = await saveGame(game, source);
    if (savedGameId) {
      savedGameIds.push(savedGameId);
    }
  }

  if (savedGameIds.length > 0) {
    await updateUserImportedGames(endchess_username, savedGameIds);
  }

  console.log(`${savedGameIds.length} games have been saved from ${source}.`);
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

    if (source === 'lichess' && !game.uuid) {
      game.uuid = generateLichessUUID(game);
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
  userId: string,
  gameIds: mongoose.Types.ObjectId[],
): Promise<void> {
  await Player.findByIdAndUpdate(userId, {
    $push: { importedGames: { $each: gameIds } },
  });
}

function generateLichessUUID(game: IGame): string {
  return `${game.white.username}-${game.black.username}-${game.end_time}`;
}
