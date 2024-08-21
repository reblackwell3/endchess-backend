declare module 'pgn-parser' {
  export interface PgnHeader {
    name: string;
    value: string;
  }

  export interface PgnGameData {
    headers: PgnHeader[];
    pgn: string; // this property is not on pgn-parser, but needs to be returned by endchess/parsePgn
  }

  export function parse(pgn: string): PgnGameData[];
}
