import { Engine, SearchResult } from 'node-uci';
import { Chess } from 'chess.js';

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

export const SHALLOW_DEPTH = 12;
export const DEEP_DEPTH = 20;

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
    .filter((info: EngineInfo) => info.depth === 12)
    .map((info: EngineInfo) => ({
      score: info.score.value,
      pv: info.pv,
      move: info.pv.split(' ')[0],
    }))
    .sort((a, b) => b.score - a.score);
  return { moves };
}

async function getTopMoves(
  fen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  depth: number,
): Promise<TopMoves> {
  const stockfish = new Engine('stockfish');
  const result = await stockfish
    .chain()
    .init()
    .setoption('MultiPV', '3')
    .position(fen)
    .go({ depth });
  return getBestMoves(result);
}

function getMoveFeedback(bestMoves: TopMoves, move: string) {
  const foundMove = bestMoves.moves.find((moveInfo) => moveInfo.move === move);
  if (!foundMove) {
    const HIGH_DIFF = 999999;
    return { isTopMove: false, diff: HIGH_DIFF };
  } else {
    const bestMove = bestMoves.moves[0];
    return { isTopMove: true, diff: bestMove.score - foundMove.score };
  }
}
