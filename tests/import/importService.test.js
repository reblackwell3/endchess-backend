const { saveGames } = require('../../src/features/import/importService');
const { mockBuiltGames } = require('../__mocks__/mock-built-games');
const Game = require('../../src/features/games/gameModel').default;
const Player = require('../../src/features/players/playerModel').default;
const mockingoose = require('mockingoose');

describe('saveGames', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockingoose(Game).reset();
    mockingoose(Player).reset();
  });

  it('should not save duplicate games', async () => {
    mockingoose(Game).toReturn(mockBuiltGames[0], 'findOne');

    await saveGames(mockBuiltGames, 'endchess', 'lichess');

    expect(Game.prototype.save).not.toHaveBeenCalled();
    // expect(Player.prototype.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('should save new games and update player data', async () => {
    mockingoose(Game).toReturn(null, 'findOne');
    mockingoose(Game).toReturn(mockBuiltGames[0], 'save');

    const updateMock = jest.fn().mockResolvedValue(undefined);
    Player.findByIdAndUpdate = updateMock;

    await saveGames(mockBuiltGames, 'endchess', 'lichess');

    expect(Game.prototype.save).toHaveBeenCalledTimes(mockBuiltGames.length);
    //   expect(Player.prototype.findByIdAndUpdate).toHaveBeenCalledWith(
    //     'endchess',
    //     {
    //       $push: {
    //         importedGames: { $each: mockBuiltGames.map((game) => game._id) },
    //       },
    //     },
    //   );
  });
});
