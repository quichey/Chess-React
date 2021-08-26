import { Piece } from "./Piece";
import { getDiagonalMoves } from "../../util/MovesUtil";
import { ColIdx, Player, RowIdx } from "../../util/SquareUtil";

type BishopProp = {
  pieceId: string;
};

export const getValidSquaresBishop = (
  player: Player,
  row: RowIdx,
  col: ColIdx,
  board: any[]
) => {
  return getDiagonalMoves(player, 8, row, col, board);
};

export const Bishop = ({ pieceId }: BishopProp) => {
  return (
    <Piece
      pieceId={pieceId}
      pieceType="Bishop"
      getValidSquares={getValidSquaresBishop}
    />
  );
};
