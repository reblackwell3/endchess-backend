function buildGame(gameData, source) {
    try {
        console.log('Building game from data:', JSON.stringify(gameData, null, 2));

        let game;

        if (source === 'Chess.com') {
            game = new Game({
                GameId: `game_${gameData.white.username}_${gameData.black.username}_${new Date(gameData.end_time * 1000).toISOString().split('T')[0]}`,
                WhitePlayer: gameData.white.username || '',
                BlackPlayer: gameData.black.username || '',
                Result: gameData.white.result === 'win' ? '1-0' : gameData.black.result === 'win' ? '0-1' : '1/2-1/2',
                Date: new Date(gameData.end_time * 1000).toISOString().split('T')[0],
                Opening: gameData.opening ? gameData.opening.name : 'Unknown',
                Moves: gameData.pgn.split(' ').map(move => move).join(' ') || '',
                PGN: gameData.pgn || '',
                WhiteElo: gameData.white.rating || '',
                BlackElo: gameData.black.rating || '',
                WhiteRatingDiff: gameData.white.ratingDiff || '',
                BlackRatingDiff: gameData.black.ratingDiff || '',
                ECO: gameData.opening ? gameData.opening.eco : 'Unknown',
                TimeControl: gameData.time_control || '',
                Termination: gameData.termination || '',
                ImportFrom: 'Chess.com'
            });
        } else if (source === 'Lichess') {
            game = new Game({
                GameId: `game_${gameData.players.white.user.name}_${gameData.players.black.user.name}_${new Date(gameData.createdAt).toISOString().split('T')[0]}`,
                WhitePlayer: gameData.players.white.user.name || '',
                BlackPlayer: gameData.players.black.user.name || '',
                Result: gameData.winner === 'white' ? '1-0' : gameData.winner === 'black' ? '0-1' : '1/2-1/2',
                Date: new Date(gameData.createdAt).toISOString().split('T')[0],
                Opening: gameData.opening ? gameData.opening.name : 'Unknown',
                Moves: gameData.moves.split(' ').map(move => move).join(' ') || '',
                PGN: gameData.pgn || '',
                WhiteElo: gameData.players.white.rating || '',
                BlackElo: gameData.players.black.rating || '',
                WhiteRatingDiff: '', // Lichess data might not provide ratingDiff
                BlackRatingDiff: '', // Lichess data might not provide ratingDiff
                ECO: gameData.opening ? gameData.opening.code : 'Unknown',
                TimeControl: gameData.clock.initial + '+' + gameData.clock.increment || '',
                Termination: gameData.status || '',
                ImportFrom: 'Lichess'
            });
        } else if (source === 'Pgn') {
            const headers = gameData.headers;

            game = new Game({
                GameId: `game_${headers.White}_${headers.Black}_${headers.UTCDate}`,
                WhitePlayer: headers.White || '',
                BlackPlayer: headers.Black || '',
                Result: headers.Result || '',
                Date: headers.UTCDate || '',
                Opening: headers.Opening || '',
                Moves: gameData.moves.map(move => move.move).join(' ') || '',
                PGN: gameData.raw || '',
                WhiteElo: headers.WhiteElo || '',
                BlackElo: headers.BlackElo || '',
                WhiteRatingDiff: headers.WhiteRatingDiff || '',
                BlackRatingDiff: headers.BlackRatingDiff || '',
                ECO: headers.ECO || '',
                TimeControl: headers.TimeControl || '',
                Termination: headers.Termination || '',
                ImportFrom: 'Pgn'
            });
        }

        console.log('game :', JSON.stringify(game, null, 2));
        return game;
    } catch (error) {
        console.error('Failed to build game:', error);
    }
    return null;
}
