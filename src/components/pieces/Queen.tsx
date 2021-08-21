import { Piece } from "./Piece";
import { getMultiDirMoves } from "../../util/MovesUtil";

type QueenProp = {
  pieceId: string;
};

export const Queen = ({ pieceId }: QueenProp) => {
  return (
    <Piece
      pieceId={pieceId}
      pieceType="Queen"
      getValidSquares={(row, col) => {
        return getMultiDirMoves(8, row, col);
      }}
    />
  );
};
