import React from "react";
import { enPassantSquare } from "../../util/EnPassant";

import { hasAnyPiece, hasPlayersPiece } from "../../util/MovesUtil";
import {
    RowIdx,
    ColIdx,
    Player,
    DivId,
    getOppositePlayer,
    PieceDivId,
    getPiecesSquareId,
    Move,
} from "../../util/SquareUtil";
import { Piece } from "./Piece";

type PawnProp = {
    pieceId: string;
};

export const getValidSquaresPawn = (
    player: Player,
    row: RowIdx,
    col: ColIdx,
    board: any[],
    pieceId: PieceDivId,
    prevMove?: Move
) => {
    const origRow = pieceId && Number(pieceId.split("-")[0]);
    var direction = origRow === 6 ? -1 : 1;
    var validSquares: DivId[] = [];
    var nextRow = (row + direction) as RowIdx;
    var hasAPiece = hasAnyPiece(nextRow, col, board);
    if (!hasAPiece) {
        validSquares.push(`${nextRow}-${col}` as DivId);
        if (
            row === origRow &&
            !hasAnyPiece((row + direction * 2) as RowIdx, col, board)
        ) {
            validSquares.push(`${row + direction * 2}-${col}` as DivId);
        }
    }
    // check diagonals for enemy piece
    var diagonalCols: ColIdx[] = [(col + 1) as ColIdx, (col - 1) as ColIdx];
    var oppositePlayer = getOppositePlayer(player);
    diagonalCols.forEach((newCol) => {
        if (hasPlayersPiece(oppositePlayer, nextRow, newCol, board)) {
            validSquares.push(`${nextRow}-${newCol}`);
        }
    });

    let enPassant = enPassantSquare(getPiecesSquareId(pieceId), prevMove);
    enPassant && validSquares.push(enPassant);
    return validSquares;
};

export const Pawn = ({ pieceId }: PawnProp) => {
    return (
        <Piece
            pieceId={pieceId}
            pieceType="Pawn"
            getValidSquares={(player, row, col, board) => {
                return getValidSquaresPawn(
                    player,
                    row,
                    col,
                    board,
                    pieceId as PieceDivId
                );
            }}
        />
    );
};
