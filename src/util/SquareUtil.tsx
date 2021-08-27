export type RowIdx = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type ColIdx = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Player = "White" | "Black" | "";
export type PieceType =
  | "King"
  | "Queen"
  | "Pawn"
  | "Rook"
  | "Bishop"
  | "Knight";

export type DivId = `${RowIdx}-${ColIdx}`;
export type PieceDivId = `${RowIdx}-${ColIdx}-${Player}`;
export type Cell = [RowIdx, ColIdx];
export type BoardPieceId =
  | {
      piece: PieceType;
      player: Player;
    }
  | "";

export const idToCell = (id: DivId) => {
  const rowCol = id.split("-").slice(0, 2);
  return [Number(rowCol[0]) as RowIdx, Number(rowCol[1]) as ColIdx];
};

export const cellToId = (cell: Cell) => {
  return `${cell[0]}-${cell[1]}-square`;
};

export const boardIdxToCell = (boardIdx: number) => {
  return [Math.floor(boardIdx / 8) as RowIdx, (boardIdx % 8) as ColIdx];
};

export const boardIdxToId = (boardIdx: number) => {
  return cellToId(boardIdxToCell(boardIdx) as Cell);
};

export const rowColToBoardIdx = (row: RowIdx, col: ColIdx) => {
  return row * 8 + col;
};

export const divIdToBoardIdx = (id: DivId) => {
  const [row, col] = idToCell(id);
  return rowColToBoardIdx(row, col);
};

export const isValidSquareId = (id: DivId) => {
  var cell = idToCell(id);
  return 0 <= cell[0] && cell[0] <= 7 && 0 <= cell[1] && cell[1] <= 7;
};

export const getOppositePlayer = (player: Player) => {
  return player === "White" ? ("Black" as Player) : ("White" as Player);
};

export const getPiecesSquareId = (pieceId: PieceDivId) => {
  const pieceEl = document.getElementById(pieceId);
  return (
    pieceEl && pieceEl.parentElement && (pieceEl.parentElement.id as DivId)
  );
};
