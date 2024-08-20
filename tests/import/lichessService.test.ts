// tests/import/lichessService.test.mjs
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { readGamesFromLichess } from '../../src/features/import/lichessService.js.js';
import { expect } from 'chai';
import sinon from 'sinon';
import buildGame from '../../src/features/import/buildGameService.js.js';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

describe('readGamesFromLichess', () => {
  let mock;
  const username = 'blackfromchina';
  // Get the directory name
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const mockPgnPath = path.join(__dirname, 'lichess-import.pgn');
  const mockPgn = fs.readFileSync(mockPgnPath, 'utf8');

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should fetch PGN data, process it with buildGame, and call save', async () => {
    // Mock the API call
    mock
      .onGet(`https://lichess.org/api/games/user/${username}`)
      .reply(200, mockPgn);

    // Create a mock game object with a save method
    const mockGame = {
      save: sinon.stub().resolves(),
    };

    // Stub the buildGame function to return the mock game
    const buildGameStub = sinon.stub(buildGame, 'buildGame').returns(mockGame);

    // Call the function
    await readGamesFromLichess(username);

    // Verify that buildGame was called with the correct parameters
    expect(buildGameStub.called).to.be.true;
    expect(buildGameStub.calledWith(sinon.match.any, 'Pgn')).to.be.true;

    // Verify that save was called on the mock game
    expect(mockGame.save.called).to.be.true;

    // Restore the stub
    buildGameStub.restore();
  });
});
