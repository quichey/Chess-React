import { Piece } from "./Piece";
import { getStraightMoves } from "../../util/MovesUtil";
import { ColIdx, Player, RowIdx } from "../../util/SquareUtil";

type RookProp = {
  pieceId: string;
};

export const getValidSquaresRook = (
  player: Player,
  row: RowIdx,
  col: ColIdx,
  board: any[]
) => {
  return getStraightMoves(player, 8, row, col, board);
};

export const Rook = ({ pieceId }: RookProp) => {
  return (
    <Piece
      pieceId={pieceId}
      pieceType="Rook"
      getValidSquares={getValidSquaresRook}
    />
  );
};
