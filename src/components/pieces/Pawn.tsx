import React from "react";

import { hasAnyPiece, hasPlayersPiece } from "../../util/MovesUtil";
import {
  RowIdx,
  ColIdx,
  DivId,
  getOppositePlayer,
} from "../../util/SquareUtil";
import { Piece } from "./Piece";

type PawnProp = {
  pieceId: string;
};

export const Pawn = ({ pieceId }: PawnProp) => {
  const origRow = pieceId && Number(pieceId.split("-")[0]);
  const color = pieceId && pieceId.split("-")[2];
  return (
    <Piece
      pieceId={pieceId}
      pieceType="Pawn"
      getValidSquares={(player, row, col, board) => {
        var direction = color === "White" ? -1 : 1;
        var validSquares: DivId[] = [];
        var nextRow = (row + direction) as RowIdx;
        var hasAPiece = hasAnyPiece(nextRow, col, board);
        if (!hasAPiece) {
          validSquares.push(`${nextRow}-${col}` as DivId);
          if (
            row === origRow &&
            !hasAnyPiece((row + direction * 2) as RowIdx, col, board)
          ) {
            validSquares.push(`${row + direction * 2}-${col}` as DivId);
          }
        }
        // check diagonals for enemy piece
        var diagonalCols: ColIdx[] = [(col + 1) as ColIdx, (col - 1) as ColIdx];
        var oppositePlayer = getOppositePlayer(player);
        diagonalCols.forEach((newCol) => {
          if (hasPlayersPiece(oppositePlayer, nextRow, newCol, board)) {
            validSquares.push(`${nextRow}-${newCol}`);
          }
        });
        return validSquares;
      }}
    />
  );
};
