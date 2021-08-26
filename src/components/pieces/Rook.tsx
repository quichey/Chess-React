import { Piece } from "./Piece";
import { getStraightMoves } from "../../util/MovesUtil";

type RookProp = {
  pieceId: string;
};

export const Rook = ({ pieceId }: RookProp) => {
  return (
    <Piece
      pieceId={pieceId}
      pieceType="Rook"
      getValidSquares={(player, row, col, board) => {
        return getStraightMoves(player, 8, row, col, board);
      }}
    />
  );
};
