import { Piece } from "./Piece";
import { getMultiDirMoves } from "../../util/MovesUtil";

type KingProp = {
  pieceId: string;
};

export const King = ({ pieceId }: KingProp) => {
  return (
    <Piece
      pieceId={pieceId}
      pieceType="King"
      getValidSquares={(player, row, col, board) => {
        return getMultiDirMoves(player, 1, row, col, board);
      }}
    />
  );
};
