export type RowIdx = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type ColIdx = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Player = "White" | "Black";
export type Piece = "King" | "Queen" | "Pawn" | "Rook" | "Bishop" | "Knight";

export type DivId = `${RowIdx}-${ColIdx}`;
export type PieceDivId = `${RowIdx}-${ColIdx}-${Player}`;
export type Cell = [RowIdx, ColIdx];
export type BoardPieceId =
  | {
      piece: Piece;
      player: Player;
    }
  | "";

export const idToCell = (id: DivId) => {
  const rowCol = id.split("-").slice(0, 2);
  return [Number(rowCol[0]) as RowIdx, Number(rowCol[1]) as ColIdx];
};

export const cellToId = (cell: Cell) => {
  return `${cell[0]}-${cell[1]}`;
};

export const rowColToBoardIdx = (row: RowIdx, col: ColIdx) => {
  return row * 8 + col;
};
