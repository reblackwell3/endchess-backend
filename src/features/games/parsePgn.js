const fs = require('fs');
const readline = require('readline');
const pgnParser = require('pgn-parser');

function parsePgn(filePath) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    var pgns = [];
    let currentPgn = [];
    let endOfHeaders = false;

    rl.on('line', (line) => {
      if (line.startsWith('[')) {
        if (endOfHeaders) {
          pgns.push(currentPgn.join('\n').trim());
          currentPgn = [];
          endOfHeaders = false;
        }
      } else {
        endOfHeaders = true;
      }
      currentPgn.push(line);
    });

    rl.on('close', () => {
      pgns.push(currentPgn.join('\n').trim());
      pgns = pgns.filter(pgn => isValidPgn(pgn));
      const parsedPgns = pgns.map(pgn => augmentParsed(pgnParser.parse(pgn), pgn));
      resolve(parsedPgns);
    });

    rl.on('error', (error) => {
      reject(error);
    });
  });
}

function isValidPgn(pgn) {
  try {
    var parsed = pgnParser.parse(pgn);
    parsed = augmentParsed(parsed);
    if (parsed.headers.White != null) {
      return true;
    }
  } catch (error) {
    console.log('Pgn parsing error');
  }
  console.log('Invalid pgn ' + pgn);
  return false;
}

function augmentParsed(parsed, rawPgn) {
  const headers = parsed[0].headers.reduce((acc, header) => {
    acc[header.name] = header.value;
    return acc;
  }, {});
  return { ...parsed[0], headers, raw: rawPgn };
}

module.exports = { parsePgn };
