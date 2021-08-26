import {
  RowIdx,
  ColIdx,
  DivId,
  Player,
  BoardPieceId,
  rowColToBoardIdx,
} from "./SquareUtil";

export const getStraightMoves = (
  player: Player,
  range: number,
  origRow: RowIdx,
  origCol: ColIdx,
  board: any[]
) => {
  var validSquares: string[] = [];
  var hasPieceAbove = false;
  var hasPieceBelow = false;
  var hasPieceRight = false;
  var hasPieceLeft = false;
  for (var i = 1; i <= range; i++) {
    var newRows = [];
    if (hasPlayersPiece(player, (origRow + i) as RowIdx, origCol, board)) {
      hasPieceRight = true;
    }
    if (hasPlayersPiece(player, (origRow - i) as RowIdx, origCol, board)) {
      hasPieceLeft = true;
    }
    if (!hasPieceRight) {
      newRows.push(origRow + i);
    }
    if (!hasPieceLeft) {
      newRows.push(origRow - i);
    }
    newRows.forEach((newRow) => {
      validSquares.push(`${newRow}-${origCol}`);
    });

    var newCols = [];
    if (hasPlayersPiece(player, origRow, (origCol + i) as ColIdx, board)) {
      hasPieceAbove = true;
    }
    if (hasPlayersPiece(player, origRow, (origCol - i) as ColIdx, board)) {
      hasPieceBelow = true;
    }
    if (!hasPieceAbove) {
      newCols.push(origCol + i);
    }
    if (!hasPieceBelow) {
      newCols.push(origCol - i);
    }
    newCols.forEach((newCol) => {
      validSquares.push(`${origRow}-${newCol}`);
    });
  }
  return validSquares as DivId[];
};

export const getDiagonalMoves = (
  player: Player,
  range: number,
  origRow: RowIdx,
  origCol: ColIdx,
  board: any[]
) => {
  var validSquares: string[] = [];
  for (var i = 1; i <= range; i++) {
    var newRows = [origRow + i, origRow - i];
    var newCols = [origCol + i, origCol - i];

    newRows.forEach((newRow) => {
      newCols.forEach((newCol) => {
        validSquares.push(`${newRow}-${newCol}`);
      });
    });
  }
  return validSquares as DivId[];
};

export const getMultiDirMoves = (
  player: Player,
  range: number,
  origRow: RowIdx,
  origCol: ColIdx,
  board: any[]
) => {
  var validSquares: string[] = getStraightMoves(
    player,
    range,
    origRow,
    origCol,
    board
  );
  validSquares = validSquares.concat(
    getDiagonalMoves(player, range, origRow, origCol, board)
  );
  return validSquares as DivId[];
};

export const hasPlayersPiece = (
  targetPlayer: Player,
  targetRow: RowIdx,
  targetCol: ColIdx,
  board: any[]
) => {
  const boardIdx: number = rowColToBoardIdx(targetRow, targetCol);
  const boardId: BoardPieceId = board[boardIdx];
  const squarePlayer: Player = boardId && boardId.player;
  return targetPlayer === squarePlayer;
};
