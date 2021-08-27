import {
  RowIdx,
  ColIdx,
  DivId,
  Player,
  BoardPieceId,
  rowColToBoardIdx,
  getOppositePlayer,
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
  var oppositePlayer = getOppositePlayer(player);
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
    //check opposite player after since first opposite player can be killed
    if (
      hasPlayersPiece(oppositePlayer, (origRow + i) as RowIdx, origCol, board)
    ) {
      hasPieceRight = true;
    }
    if (
      hasPlayersPiece(oppositePlayer, (origRow - i) as RowIdx, origCol, board)
    ) {
      hasPieceLeft = true;
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
    //check opposite player after since first opposite player can be killed
    if (
      hasPlayersPiece(oppositePlayer, origRow, (origCol + i) as ColIdx, board)
    ) {
      hasPieceAbove = true;
    }
    if (
      hasPlayersPiece(oppositePlayer, origRow, (origCol - i) as ColIdx, board)
    ) {
      hasPieceBelow = true;
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
  var hasPieceTopRight = false;
  var hasPieceTopLeft = false;
  var hasPieceBottomRight = false;
  var hasPieceBottomLeft = false;
  var oppositePlayer = getOppositePlayer(player);
  for (var i = 1; i <= range; i++) {
    var newRows = [origRow + i, origRow - i];
    var newCols = [origCol + i, origCol - i];

    newRows.forEach((newRow) => {
      newCols.forEach((newCol) => {
        var isTopRight = newRow === origRow - i && newCol === origCol + i;
        var isTopLeft = newRow === origRow - i && newCol === origCol - i;
        var isBottomRight = newRow === origRow + i && newCol === origCol + i;
        var isBottomLeft = newRow === origRow + i && newCol === origCol - i;
        var hasOwnPiece = hasPlayersPiece(
          player,
          newRow as RowIdx,
          newCol as ColIdx,
          board
        );
        var hasOppositePiece = hasPlayersPiece(
          oppositePlayer,
          newRow as RowIdx,
          newCol as ColIdx,
          board
        );
        var isValid = !hasOwnPiece;

        if (isTopRight) {
          hasPieceTopRight = hasPieceTopRight || hasOwnPiece;
          isValid = !hasPieceTopRight;
        }
        if (isTopLeft) {
          hasPieceTopLeft = hasPieceTopLeft || hasOwnPiece;
          isValid = !hasPieceTopLeft;
        }
        if (isBottomRight) {
          hasPieceBottomRight = hasPieceBottomRight || hasOwnPiece;
          isValid = !hasPieceBottomRight;
        }
        if (isBottomLeft) {
          hasPieceBottomLeft = hasPieceBottomLeft || hasOwnPiece;
          isValid = !hasPieceBottomLeft;
        }
        isValid && validSquares.push(`${newRow}-${newCol}`);
        //check opposite player after since first opposite player can be killed
        if (isTopRight) {
          hasPieceTopRight = hasPieceTopRight || hasOppositePiece;
        }
        if (isTopLeft) {
          hasPieceTopLeft = hasPieceTopLeft || hasOppositePiece;
        }
        if (isBottomRight) {
          hasPieceBottomRight = hasPieceBottomRight || hasOppositePiece;
        }
        if (isBottomLeft) {
          hasPieceBottomLeft = hasPieceBottomLeft || hasOppositePiece;
        }
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

export const hasAnyPiece = (
  targetRow: RowIdx,
  targetCol: ColIdx,
  board: any[]
) => {
  const boardIdx: number = rowColToBoardIdx(targetRow, targetCol);
  const boardId: BoardPieceId = board[boardIdx];
  const squarePlayer: Player = boardId && boardId.player;
  return squarePlayer;
};

export const getPlayerBoardInfo = (player: Player, board: any[]) => {
  const withIdx = board.map((boardId, idx) => {
    if (boardId) {
      return [boardId, idx];
    } else {
      return "";
    }
  });
  return withIdx.filter((boardInfo) => {
    return boardInfo && boardInfo[0].player === player;
  }) as [BoardPieceId, number][];
};
