const { readGamesFromChessCom } = require('./chessComService'); // Adjust the path if necessary
const { readGamesFromLichess } = require('./lichessService'); // Adjust the path if necessary


async function importChesscomGames(req, res) {
    const username = req.params.username;

    try {
        await readGamesFromChessCom(username);
        res.status(200).json({ message: 'Chess.com games imported successfully' });
    } catch (error) {
        console.error('Error importing Chess.com games:', error);
        res.status(500).json({ error: 'Failed to import Chess.com games' });
    }
}

async function importLichessGames(req, res) {
  const username = req.params.username;

  try {
      await readGamesFromLichess(username);
      res.status(200).json({ message: 'Lichess games imported successfully' });
  } catch (error) {
      console.error('Error importing Lichess games:', error);
      res.status(500).json({ error: 'Failed to import Lichess games' });
  }
}

module.exports = { importChesscomGames, importLichessGames };
