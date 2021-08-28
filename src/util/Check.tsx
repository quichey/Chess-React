import {
    getValidSquaresByType,
    getValidSquaresWithCheck,
} from "../components/pieces/Piece";
import { getPlayerBoardInfo } from "./MovesUtil";
import {
    boardIdxToCell,
    boardIdxToId,
    BoardPieceId,
    DivId,
    divIdToBoardIdx,
    getOppositePlayer,
    PieceType,
    Player,
} from "./SquareUtil";

export const isCheckMate = (currPlayer: Player, board: any[]) => {
    /*
  var allPossibleBoards: any[][] = [];

  for (var i in allPossibleBoards) {
    var possBoard = allPossibleBoards[i];
    if (!isInCheck(currPlayer, possBoard)) {
      return false;
    }
  }
  return true;
  */
    /*
  if (!isInCheck(currPlayer, board)) {
    return false
  } 

  var playersPieces = board.filter((boardId) => {
    return boardId && boardId.player === currPlayer
  })

  for (var i in playersPieces) {
    var currPiece = playersPieces[i],

    getValidSquaresWithCheck(
      currPlayer,

    )
  }
  */
};

export const isInCheck = (currPlayer: Player, board: any[]) => {
    const oppositePlayer = getOppositePlayer(currPlayer);
    const enemyBoardInfo: [BoardPieceId, number][] = getPlayerBoardInfo(
        oppositePlayer,
        board
    );
    let isInCheck = false;
    let kingBoardIdx = -1;
    board.find((boardId, idx) => {
        kingBoardIdx = Number(idx);
        return (
            boardId && boardId.piece === "King" && boardId.player === currPlayer
        );
    });
    var kingSquareId = boardIdxToId(kingBoardIdx);
    for (var i = 0; i < enemyBoardInfo.length; i++) {
        var boardInfo = enemyBoardInfo[i];
        var boardInfoIdx = boardInfo[1];
        var [row, col] = boardIdxToCell(boardInfoIdx);
        var piece = boardInfo[0] && boardInfo[0].piece;

        var pieceDivId = document.getElementById(
            boardIdxToId(Number(boardInfoIdx))
        )?.children[0]?.id;

        let moveSet: string[] = getValidSquaresByType(
            oppositePlayer,
            piece,
            row,
            col,
            board,
            pieceDivId as string
        );
        for (var moveIdx in moveSet) {
            if (moveSet[moveIdx] + "-square" === kingSquareId) {
                isInCheck = true;
                break;
            }
        }
        if (isInCheck) {
            break;
        }
    }
    return isInCheck;
};

export const filterValidSquaresWithCheck = (
    player: Player,
    pieceType: PieceType,
    validSquares: DivId[],
    board: any[],
    originalBoardIdx: number
) => {
    return validSquares.filter((divId: DivId) => {
        let boardWithNewSquare = JSON.parse(JSON.stringify(board));
        boardWithNewSquare[originalBoardIdx] = "";
        boardWithNewSquare[divIdToBoardIdx(divId)] = {
            player: player,
            piece: pieceType,
        };
        return !isInCheck(player, boardWithNewSquare);
    });
};
