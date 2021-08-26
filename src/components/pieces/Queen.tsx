import { Piece } from "./Piece";
import { getMultiDirMoves } from "../../util/MovesUtil";
import { ColIdx, Player, RowIdx } from "../../util/SquareUtil";

type QueenProp = {
  pieceId: string;
};

export const getValidSquaresQueen = (
  player: Player,
  row: RowIdx,
  col: ColIdx,
  board: any[]
) => {
  return getMultiDirMoves(player, 8, row, col, board);
};

export const Queen = ({ pieceId }: QueenProp) => {
  return (
    <Piece
      pieceId={pieceId}
      pieceType="Queen"
      getValidSquares={getValidSquaresQueen}
    />
  );
};
