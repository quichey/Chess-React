import { Piece } from "./Piece";
import { getMultiDirMoves } from "../../util/MovesUtil";
import { ColIdx, DivId, Player, RowIdx } from "../../util/SquareUtil";
import { canCastle } from "../../util/Castling";

type KingProp = {
    pieceId: string;
};

export const getValidSquaresKing = (
    player: Player,
    row: RowIdx,
    col: ColIdx,
    board: any[]
) => {
    let castleDivsIds: DivId[] = canCastle(player, board);
    return getMultiDirMoves(player, 1, row, col, board).concat(castleDivsIds);
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
