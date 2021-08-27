import { Piece } from "./Piece";
import { getMultiDirMoves } from "../../util/MovesUtil";
import { ColIdx, Player, RowIdx } from "../../util/SquareUtil";

type KingProp = {
  pieceId: string;
};

export const getValidSquaresKing = (
  player: Player,
  row: RowIdx,
  col: ColIdx,
  board: any[]
) => {
  return getMultiDirMoves(player, 1, row, col, board);
};

export const King = ({ pieceId }: KingProp) => {
  return (
    <Piece
      pieceId={pieceId}
      pieceType="King"
      getValidSquares={getValidSquaresKing}
    />
  );
};
