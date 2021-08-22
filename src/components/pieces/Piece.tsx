import React from "react";
import King_Black from "../../util/images/King_Black.svg";
import Queen_Black from "../../util/images/Queen_Black.svg";
import Pawn_Black from "../../util/images/Pawn_Black.svg";
import Rook_Black from "../../util/images/Rook_Black.svg";
import Bishop_Black from "../../util/images/Bishop_Black.svg";
import Knight_Black from "../../util/images/Knight_Black.svg";

import King_White from "../../util/images/King_White.svg";
import Queen_White from "../../util/images/Queen_White.svg";
import Pawn_White from "../../util/images/Pawn_White.svg";
import Rook_White from "../../util/images/Rook_White.svg";
import Bishop_White from "../../util/images/Bishop_White.svg";
import Knight_White from "../../util/images/Knight_White.svg";

const svgs: any = {
  King_Black: King_Black,
  Queen_Black: Queen_Black,
  Pawn_Black: Pawn_Black,
  Rook_Black: Rook_Black,
  Bishop_Black: Bishop_Black,
  Knight_Black: Knight_Black,

  King_White: King_White,
  Queen_White: Queen_White,
  Pawn_White: Pawn_White,
  Rook_White: Rook_White,
  Bishop_White: Bishop_White,
  Knight_White: Knight_White,
};

interface PieceProps {
  pieceType: string;
  pieceId: string;
  getValidSquares: (row: number, col: number) => string[];
}

export const Piece = ({ pieceType, pieceId, getValidSquares }: PieceProps) => {
  const drag = (event: any) => {
    event.dataTransfer.setData("dragId", event.target.id);
    const [row, col] = event.target.id
      .split("-")
      .map((val: string) => Number(val));
    event.dataTransfer.setData(
      "validSquares",
      JSON.stringify(getValidSquares(row, col))
    );
  };

  const color = pieceId && pieceId.split("-")[2];

  return (
    //<div style={{ width: 100, height: 100 }}>
    <img
      width="80px"
      height="80px"
      id={pieceId}
      src={svgs[`${pieceType}_${color}`]}
      alt="test"
      onDragStart={drag}
      draggable
    ></img>
    //</div>
  );
};
