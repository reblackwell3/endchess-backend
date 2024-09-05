import { Chess, Move } from 'chess.js';
import { TopMoves, getTopMoves } from './engine'; // Import from the new engine module

export interface MoveAnalysis {
  fen: string;
  move: string;
  isTopMove: boolean;
  diff: number;
}
export async function analyzeGameFromPgn(pgn: string, depth: number) {
  const chess = new Chess();
  chess.loadPgn(pgn);
  const history: Move[] = chess.history({ verbose: true });
  const feedbacks = await analyzeGameFromHistory(history, depth);
  return feedbacks;
}

async function analyzeGameFromHistory(
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

export async function analyzeMove(fen: string, move: string, depth: number) {
  const topMoves = await getTopMoves(fen, depth);
  const feedback = getMoveFeedback(topMoves, move);
  return { fen, move, ...feedback };
}

function getMoveFeedback(bestMoves: TopMoves, move: string) {
  const foundMove = bestMoves.moves.find((moveInfo) => moveInfo.move === move);
  const bestMove = bestMoves.moves[0];
  const worstTopMove = bestMoves.moves[bestMoves.moves.length - 1];
  if (!foundMove) {
    return { isTopMove: false, diff: bestMove.score - worstTopMove.score };
  } else {
    return { isTopMove: true, diff: bestMove.score - foundMove.score };
  }
}
