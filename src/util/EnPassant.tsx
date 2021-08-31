import {
    boardIdxToCell,
    boardIdxToId,
    DivId,
    idToCell,
    Move,
} from "./SquareUtil";

export const enPassantSquare = (
    pawnSquareDivId: DivId | null,
    prevMove: Move | undefined
) => {
    if (!pawnSquareDivId) return;
    if (!prevMove) return;
    if (prevMove.pieceType !== "Pawn") return;

    let currPlayer = pawnSquareDivId.split("-")[2];
    if (prevMove.player === currPlayer) return;

    if (Math.abs(prevMove.oldBoardIdx - prevMove.newBoardIdx) !== 16) return;

    let [moveRow, moveCol] = boardIdxToCell(prevMove.newBoardIdx);
    let [pawnRow, pawnCol] = idToCell(pawnSquareDivId);
    if (pawnRow === moveRow && Math.abs(moveCol - pawnCol) === 1) {
        let enPassantBoardIdx =
            (prevMove.oldBoardIdx + prevMove.newBoardIdx) / 2;
        return boardIdxToId(enPassantBoardIdx).slice(0, 3) as DivId;
    }
};
