import React from "react";

import { BoardContext } from "../Board";
import { getValidSquaresBishop } from "./Bishop";
import { getValidSquaresQueen } from "./Queen";
import { getValidSquaresRook } from "./Rook";
import { getValidSquaresKnight } from "./Knight";

import {
  RowIdx,
  PieceType,
  ColIdx,
  DivId,
  PieceDivId,
  Player,
  isValidSquareId,
  divIdToBoardIdx,
} from "../../util/SquareUtil";
import King_Black from "../../util/images/King_Black.svg";
import Queen_Black from "../../util/images/Queen_Black.svg";
import Pawn_Black from "../../util/images/Pawn_Black.svg";
import Rook_Black from "../../util/images/Rook_Black.svg";
import Bishop_Black from "../../util/images/Bishop_Black.svg";
import Knight_Black from "../../util/images/Knight_Black.svg";

import King_White from "../../util/images/King_White.svg";
import Queen_White from "../../util/images/Queen_White.svg";
import Pawn_White from "../../util/images/Pawn_White.svg";
import Rook_White from "../../util/images/Rook_White.svg";
import Bishop_White from "../../util/images/Bishop_White.svg";
import Knight_White from "../../util/images/Knight_White.svg";
import { getValidSquaresPawn } from "./Pawn";
import { getValidSquaresKing } from "./King";
import { filterValidSquaresWithCheck } from "../../util/Check";

const svgs: any = {
  King_Black: King_Black,
  Queen_Black: Queen_Black,
  Pawn_Black: Pawn_Black,
  Rook_Black: Rook_Black,
  Bishop_Black: Bishop_Black,
  Knight_Black: Knight_Black,

  King_White: King_White,
  Queen_White: Queen_White,
  Pawn_White: Pawn_White,
  Rook_White: Rook_White,
  Bishop_White: Bishop_White,
  Knight_White: Knight_White,
};

interface PieceProps {
  pieceType: string;
  pieceId: string;
  getValidSquares: (
    player: Player,
    row: RowIdx,
    col: ColIdx,
    board: any[]
  ) => DivId[];
}

export const getValidSquaresByType = (
  player: Player,
  pieceType: string,
  row: RowIdx,
  col: ColIdx,
  board: any[],
  pieceId: string
) => {
  let getValidSquaresFunc: any = null;
  switch (pieceType) {
    case "King":
      getValidSquaresFunc = getValidSquaresKing;
      break;
    case "Queen":
      getValidSquaresFunc = getValidSquaresQueen;
      break;
    case "Rook":
      getValidSquaresFunc = getValidSquaresRook;
      break;
    case "Bishop":
      getValidSquaresFunc = getValidSquaresBishop;
      break;
    case "Knight":
      getValidSquaresFunc = getValidSquaresKnight;
      break;
    case "Pawn":
      getValidSquaresFunc = getValidSquaresPawn;
      break;
  }
  return (
    (getValidSquaresFunc &&
      getValidSquaresFunc(player, row, col, board, pieceId)) ||
    []
  );
};

let getValidSquaresWithCheck = (
  player: Player,
  row: RowIdx,
  col: ColIdx,
  board: any[],
  piece: PieceType,
  pieceBoardIdx: number
) => {};

export const Piece = ({ pieceType, pieceId, getValidSquares }: PieceProps) => {
  const boardContext = React.useContext(BoardContext);
  const drag = (event: any) => {
    event.dataTransfer.setData("dragId", event.target.id);
    const getPiecesSquare = event.target.parentElement.id.split("-");
    const pieceBoardIdx = divIdToBoardIdx(event.target.parentElement.id);
    const boardId = boardContext.board[pieceBoardIdx];
    const pieceId: PieceDivId = event.target.id.split("-");
    const row = Number(getPiecesSquare[0]) as RowIdx;
    const col = Number(getPiecesSquare[1]) as RowIdx;
    const player: Player = pieceId[2] as Player;
    var validSquares = getValidSquares(
      player,
      row,
      col,
      boardContext.board
    ).filter(isValidSquareId);
    validSquares = filterValidSquaresWithCheck(
      player,
      boardId.piece,
      validSquares,
      boardContext.board,
      pieceBoardIdx
    );
    event.dataTransfer.setData("validSquares", JSON.stringify(validSquares));
  };

  const color = pieceId && pieceId.split("-")[2];

  return (
    //<div style={{ width: 100, height: 100 }}>
    <img
      width="80px"
      height="80px"
      id={pieceId}
      src={svgs[`${pieceType}_${color}`]}
      alt="test"
      onDragStart={drag}
      draggable
      onClick={() => boardContext.setInMoving(pieceId)}
      style={
        boardContext.inMoving === pieceId ? { backgroundColor: "green" } : {}
      }
    ></img>
    //</div>
  );
};
