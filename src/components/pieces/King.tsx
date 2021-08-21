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
      getValidSquares={(row, col) => {
        return getMultiDirMoves(1, row, col);
      }}
    />
  );
};
