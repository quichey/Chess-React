import { getValidSquaresByType } from "../components/pieces/Piece";
import { getPlayerBoardInfo, pieceHasMoved } from "./MovesUtil";
import {
    boardIdxToCell,
    boardIdxToId,
    BoardPieceId,
    DivId,
    divIdToBoardIdx,
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
    //const kingSquareDivId = boardIdxToId(kingInfo.idx);
    const kingPieceDivId: PieceDivId | undefined = pieceDivIds.find((divId) => {
        return divId.includes("King");
    });

    if (!kingPieceDivId) return [];
    /*
    const rookInfos = boardInfos.filter((boardInfo) => {
        return (
            boardInfo &&
            boardInfo.piece === "Rook" &&
            boardInfo.player === player
        );
    });
    const rookSquareDivIds = rookInfos.map((rookInfo) => {
        return boardIdxToId(rookInfo.idx);
    });*/
    const rookPieceDivIds = pieceDivIds.filter((divId) => {
        return divId.includes("Rook");
    });

    const castlingPieceDivIds: PieceDivId[] = [
        kingPieceDivId,
        ...rookPieceDivIds,
    ];
    for (var i in castlingPieceDivIds) {
        if (pieceHasMoved(castlingPieceDivIds[i])) {
            return [];
        }
    }

    //can tell left and right rook by comparing the column numbers
    let leftRook: PieceDivId | undefined = rookPieceDivIds.find((divId) => {
        return divId.charAt(2) < kingPieceDivId.charAt(2);
    }) as PieceDivId;
    let rightRook: PieceDivId | undefined = rookPieceDivIds.find((divId) => {
        return divId.charAt(2) > kingPieceDivId.charAt(2);
    }) as PieceDivId;

    let castleDivIds: DivId[] = [];

    //check castling left
    if (leftRook && !pieceHasMoved(leftRook)) {
        let boardIndicesBetween = [];
        let currIdx = divIdToBoardIdx(leftRook as DivId) + 1;
        while (currIdx < kingInfo.idx) {
            boardIndicesBetween.push(currIdx);
            currIdx++;
        }
        let hasPieceBetween = false;
        boardIndicesBetween.forEach((idx: number) => {
            if (board[idx]) {
                hasPieceBetween = true;
            }
        });
        if (!hasPieceBetween) {
            let hasPieceAttacking = false;
            let checkAttackIndices = [kingInfo.idx - 1, kingInfo.idx - 2];
            checkAttackIndices.forEach((idx: number) => {
                if (
                    squareIsAttacked(board, boardIdxToId(idx) as DivId, player)
                ) {
                    hasPieceAttacking = true;
                }
            });

            if (!hasPieceAttacking) {
                castleDivIds.push(
                    boardIdxToId(kingInfo.idx - 2).slice(0, 3) as DivId
                );
            }
        }
    }

    //check castling right
    if (rightRook && !pieceHasMoved(rightRook)) {
        let boardIndicesBetween = [];
        let currIdx = divIdToBoardIdx(rightRook as DivId) - 1;
        while (currIdx > kingInfo.idx) {
            boardIndicesBetween.push(currIdx);
            currIdx--;
        }
        let hasPieceBetween = false;
        boardIndicesBetween.forEach((idx: number) => {
            if (board[idx]) {
                hasPieceBetween = true;
            }
        });
        if (!hasPieceBetween) {
            let hasPieceAttacking = false;
            let checkAttackIndices = [kingInfo.idx + 1, kingInfo.idx + 2];
            checkAttackIndices.forEach((idx: number) => {
                if (
                    squareIsAttacked(board, boardIdxToId(idx) as DivId, player)
                ) {
                    hasPieceAttacking = true;
                }
            });

            if (!hasPieceAttacking) {
                castleDivIds.push(
                    boardIdxToId(kingInfo.idx + 2).slice(0, 3) as DivId
                );
            }
        }
    }
    return castleDivIds;
};
