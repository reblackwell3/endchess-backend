import { expect } from 'chai';
import path from 'path';
import { fileURLToPath } from 'url';
import { parsePgn } from '../../src/features/games/parsePgn.js';  // Adjust the path as needed

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('parsePgn', () => {
  it('should parse a PGN file with multiple games correctly', async () => {
    const pgnPath = path.resolve(__dirname, '../data/two-games.pgn');
    const parsedPgns = await parsePgn(pgnPath);

//    console.log('Parsed PGN Data:', JSON.stringify(parsedPgns, null, 2));

    expect(parsedPgns).to.have.lengthOf(2);

    expect(parsedPgns[0].headers.White).to.equal('borgs');
    expect(parsedPgns[0].headers.Black).to.equal('IntiTupac');
    expect(parsedPgns[0].headers.Result).to.equal('0-1');
    expect(parsedPgns[0].headers.UTCDate).to.equal('2016.02.29');
    expect(parsedPgns[0].headers.WhiteElo).to.equal('1726');
    expect(parsedPgns[0].headers.BlackElo).to.equal('1702');
    expect(parsedPgns[0].headers.WhiteRatingDiff).to.equal('-12');
    expect(parsedPgns[0].headers.BlackRatingDiff).to.equal('+14');
    expect(parsedPgns[0].headers.ECO).to.equal('A13');
    expect(parsedPgns[0].headers.TimeControl).to.equal('600+0');
    expect(parsedPgns[0].headers.Termination).to.equal('Time forfeit');
    expect(parsedPgns[0].moves.map(move => move.move).join(' ')).to.contain('c4 e6 Nf3 a6');

    expect(parsedPgns[1].headers.White).to.equal('BrettDale');
    expect(parsedPgns[1].headers.Black).to.equal('Viriskensoshir');
    expect(parsedPgns[1].headers.Result).to.equal('0-1');
    expect(parsedPgns[1].headers.UTCDate).to.equal('2016.02.29');
    expect(parsedPgns[1].headers.WhiteElo).to.equal('1905');
    expect(parsedPgns[1].headers.BlackElo).to.equal('1949');
    expect(parsedPgns[1].headers.WhiteRatingDiff).to.equal('-10');
    expect(parsedPgns[1].headers.BlackRatingDiff).to.equal('+10');
    expect(parsedPgns[1].headers.ECO).to.equal('B72');
    expect(parsedPgns[1].headers.TimeControl).to.equal('180+0');
    expect(parsedPgns[1].headers.Termination).to.equal('Normal');
    expect(parsedPgns[1].moves.map(move => move.move).join(' ')).to.contain('e4 c5 Nf3 d6');
  });

  it('should ignore bad start and end of pgn', async () => {
    const pgnPath = path.resolve(__dirname, '../data/bad-start-and-end.pgn');
    const parsedPgns = await parsePgn(pgnPath);
    expect(parsedPgns).to.have.lengthOf(1);
    expect(parsedPgns[0].headers.White).to.equal('Mescalero25');
  });
});
