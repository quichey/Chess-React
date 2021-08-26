import { Piece } from "./Piece";
import { getDiagonalMoves } from "../../util/MovesUtil";

type BishopProp = {
  pieceId: string;
};

export const Bishop = ({ pieceId }: BishopProp) => {
  return (
    <Piece
      pieceId={pieceId}
      pieceType="Bishop"
      getValidSquares={(player, row, col, board) => {
        return getDiagonalMoves(player, 8, row, col, board);
      }}
    />
  );
};
