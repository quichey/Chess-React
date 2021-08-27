import { Piece } from "./Piece";
import { DivId, Player, RowIdx, ColIdx } from "../../util/SquareUtil";

type KnightProp = {
  pieceId: string;
};

export const getValidSquaresKnight = (
  player: Player,
  row: RowIdx,
  col: ColIdx,
  board: any[]
) => {
  const validChanges: number[] = [+2, -2, +1, -1];
  var validSquares: string[] = [];
  validChanges.forEach((rowChange) => {
    validChanges.forEach((colChange) => {
      if (Math.abs(rowChange) !== Math.abs(colChange)) {
        validSquares.push(`${row + rowChange}-${col + colChange}`);
      }
    });
  });
  return validSquares as DivId[];
};

export const Knight = ({ pieceId }: KnightProp) => {
  return (
    <Piece
      pieceId={pieceId}
      pieceType="Knight"
      getValidSquares={getValidSquaresKnight}
    />
  );
};
