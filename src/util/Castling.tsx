import { getValidSquaresByType } from "../components/pieces/Piece";
import { getPlayerBoardInfo, pieceHasMoved } from "./MovesUtil";
import {
    boardIdxToCell,
    boardIdxToId,
    BoardPieceId,
    DivId,
    getBoardInfos,
    getOppositePlayer,
    getPlayersPieceDivIds,
    PieceDivId,
    Player,
} from "./SquareUtil";

export const pieceAttacksSquare = (
    boardId: BoardPieceId,
    boardIdx: number,
    board: any[],
    targetDivId: DivId
) => {
    var [row, col] = boardIdxToCell(boardIdx);
    var piece = boardId && boardId.piece;

    var pieceDivId = document.getElementById(boardIdxToId(Number(boardIdx)))
        ?.children[0]?.id;

    let moveSet: string[] = getValidSquaresByType(
        boardId && boardId.player,
        piece,
        row,
        col,
        board,
        pieceDivId as string
    );
    for (var moveIdx in moveSet) {
        if (moveSet[moveIdx] + "-square" === targetDivId) {
            return true;
        }
    }
    return false;
};

export const squareIsAttacked = (
    board: any[],
    targetDivId: DivId,
    player: Player
) => {
    const enemyPlayersPieces = getPlayerBoardInfo(
        getOppositePlayer(player),
        board
    );
    console.log(enemyPlayersPieces);
    for (var i in enemyPlayersPieces) {
        var [boardId, boardIdx] = enemyPlayersPieces[i];
        if (pieceAttacksSquare(boardId, boardIdx, board, targetDivId)) {
            return true;
        }
    }
    return false;
};

export const canCastle = (player: Player, board: any[]) => {
    const boardInfos = getBoardInfos(board);
    const pieceDivIds = getPlayersPieceDivIds(player);
    const kingInfo = boardInfos.find((boardInfo) => {
        return (
            boardInfo &&
            boardInfo.piece === "King" &&
            boardInfo.player === player
        );
    });
    const kingSquareDivId = boardIdxToId(kingInfo.idx);
    const kingPieceDivId: PieceDivId | undefined = pieceDivIds.find((divId) => {
        return divId.includes("King");
    });

    if (!kingPieceDivId) return false;

    const rookInfos = boardInfos.filter((boardInfo) => {
        return (
            boardInfo &&
            boardInfo.piece === "Rook" &&
            boardInfo.player === player
        );
    });
    const rookSquareDivIds = rookInfos.map((rookInfo) => {
        return boardIdxToId(rookInfo.idx);
    });
    const rookPieceDivIds = pieceDivIds.filter((divId) => {
        return divId.includes("Rook");
    });

    const castlingPieceDivIds: PieceDivId[] = [
        kingPieceDivId,
        ...rookPieceDivIds,
    ];
    for (var i in castlingPieceDivIds) {
        if (pieceHasMoved(castlingPieceDivIds[i])) {
            return false;
        }
    }

    console.log(kingSquareDivId + rookSquareDivIds);
};
