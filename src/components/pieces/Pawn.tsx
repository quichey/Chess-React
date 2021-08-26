import React from "react";

import { hasAnyPiece } from "../../util/MovesUtil";
import { DivId, RowIdx } from "../../util/SquareUtil";
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
        var hasAPiece = hasAnyPiece((row + direction) as RowIdx, col, board);
        if (!hasAPiece) {
          validSquares.push(`${row + direction}-${col}` as DivId);
          if (
            row === origRow &&
            !hasAnyPiece((row + direction * 2) as RowIdx, col, board)
          ) {
            validSquares.push(`${row + direction * 2}-${col}` as DivId);
          }
        }
        return validSquares;
      }}
    />
  );
};
