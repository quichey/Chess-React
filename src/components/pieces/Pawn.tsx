import { DivId } from "../../util/SquareUtil";
import { Piece } from "./Piece";

type PawnProp = {
  pieceId: string;
};

export const Pawn = ({ pieceId }: PawnProp) => {
  //const img = false ? SVG : <img src="http://www.w3.org/2000/svg" alt="PAWN" />;
  const color = pieceId && pieceId.split("-")[2];
  return (
    <Piece
      pieceId={pieceId}
      pieceType="Pawn"
      getValidSquares={(player, row, col, board) => {
        var validCols = [0, 1, 2, 3, 4, 5, 6, 7];
        var direction = color === "White" ? -1 : 1;
        return validCols.map((validCol) => {
          return `${row + direction}-${validCol}` as DivId;
        });
      }}
    />
  );
};
