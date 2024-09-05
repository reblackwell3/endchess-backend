import { Engine, SearchResult } from 'node-uci';
import { Chess, Move } from 'chess.js';

export type EngineInfo = {
  depth: number;
  seldepth: number;
  time: number;
  nodes: number;
  nps: number;
  tbhits: number;
  score: {
    unit: string;
    value: number;
  };
  multipv: number;
  pv: string;
};

export interface TopMoves {
  moves: { score: number; pv: string; move: string }[];
}

export interface MoveAnalysis {
  fen: string;
  move: string;
  isTopMove: boolean;
  diff: number;
}

export const SHALLOW_DEPTH = 8;
export const DEEP_DEPTH = 18;

export async function analyzeMove(fen: string, move: string, depth: number) {
  const topMoves = await getTopMoves(fen, depth);
  const feedback = getMoveFeedback(topMoves, move);
  return { fen, move, ...feedback };
}

export async function analyzeGame(
  moves: string[],
  depth: number,
): Promise<MoveAnalysis[]> {
  const positions = await buildPositions(moves);
  const feedbacks = await Promise.all(
    positions.map(async (position) => {
      return analyzeMove(position.fen, position.move, depth);
    }),
  );
  return feedbacks;
}

export async function analyzeGameFromHistory(
  moves: Move[],
  depth: number,
): Promise<MoveAnalysis[]> {
  const feedbacks = await Promise.all(
    moves.map(async (move) => {
      return analyzeMove(move.before, move.lan, depth);
    }),
  );
  return feedbacks;
}

export async function analyzeGameFromPgn(pgn: string, depth: number) {
  const chess = new Chess();
  chess.loadPgn(pgn);
  const history: Move[] = chess.history({ verbose: true });
  const feedbacks = await analyzeGameFromHistory(history, depth);
  return feedbacks;
}

function buildPositions(moves: string[]) {
  const chess = new Chess();
  const positions = moves.map((move) => {
    const position = { fen: chess.fen(), move: move };
    chess.move(move);
    return position;
  });
  return positions;
}

function getBestMoves(result: SearchResult): TopMoves {
  const moves = (result.info as unknown[])
    .map((value: unknown) => value as EngineInfo)
    .filter((info: EngineInfo) => info.depth === SHALLOW_DEPTH)
    .filter((info: EngineInfo) => info.score)
    .map((info: EngineInfo) => ({
      score: info.score.value,
      pv: info.pv,
      move: info.pv.split(' ')[0],
    }))
    .sort((a, b) => b.score - a.score);
  return { moves };
}

const LINES = 3;
async function getTopMoves(
  fen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  depth: number,
): Promise<TopMoves> {
  const stockfish = new Engine('stockfish');
  const result = await stockfish
    .chain()
    .init()
    .setoption('MultiPV', LINES.toString())
    .position(fen)
    .go({ depth });

  return getBestMoves(result);
}

function getMoveFeedback(bestMoves: TopMoves, move: string) {
  const foundMove = bestMoves.moves.find((moveInfo) => moveInfo.move === move);
  const bestMove = bestMoves.moves[0];
  const worstTopMove = bestMoves.moves[LINES - 1];
  if (!foundMove) {
    return { isTopMove: false, diff: bestMove.score - worstTopMove.score };
  } else {
    return { isTopMove: true, diff: bestMove.score - foundMove.score };
  }
}
