const { saveGames } = require('../../src/features/import/importService');
const { mockBuiltGames } = require('../__mocks__/mockBuiltGames');
const Game = require('../../src/features/games/gameModel').default;
const mockingoose = require('mockingoose');

describe('saveGames', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockingoose(Game).reset();
  });

  it('should not save duplicate games', async () => {
    mockingoose(Game).toReturn(mockBuiltGames[0], 'findOne');
    // const games = Array.from(mockBuiltGames[0], mockBuiltGames[1]);
    await saveGames(
      mockBuiltGames, // temporary workaround, without wrapping in array prototype array is nmissing
      'endchess',
      'lichess',
    );

    expect(Game.prototype.save).not.toHaveBeenCalled();
  });

  it('should save new games and update player data', async () => {
    mockingoose(Game).toReturn(null, 'findOne');
    mockingoose(Game).toReturn(mockBuiltGames[0], 'save');

    await saveGames(
      mockBuiltGames, // temporary workaround, without wrapping in array prototype array is nmissing
      'endchess',
      'lichess',
    );

    expect(Game.prototype.save).toHaveBeenCalledTimes(mockBuiltGames.length);
  });
});
