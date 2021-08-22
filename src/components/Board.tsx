import React from "react";
import { King } from "./pieces/King";
import { Queen } from "./pieces/Queen";
import { Pawn } from "./pieces/Pawn";
import { Rook } from "./pieces/Rook";
import { Bishop } from "./pieces/Bishop";
import { Knight } from "./pieces/Knight";

import { rowColToBoardIdx, idToCell } from "../util/SquareUtil";

export const Board = () => {
  const col = new Array(8);
  col.fill(80);
  const row = new Array(8);
  row.fill(80);
  const gameBoardCss = {
    display: "grid",
    gridTemplateColumns: col.map((size) => `${size}px`).join(" "),
    //gridTemplateColumns: "120px 120px 120px",
    gridTemplateRows: row.map((size) => `${size}px`).join(" "),
    justifyContent: "center",
    height: "800px",
  };

  const boxCss = {
    backgroundColor: "#d9d9d9",
    border: "2px solid black",
  };

  const initialBoard = Array(64).fill("");
  const divs: React.ReactNode[] = [];

  row.forEach((el, idx) => {
    col.forEach((el2, idx2) => {
      let piece: JSX.Element | "" = "";
      let color: "White" | "Black" = idx > 3 ? "White" : "Black";
      var pieceId = `${idx}-${idx2}-${color}`;
      let boardPieceId = "";
      if (idx === 1 || idx === 6) {
        piece = <Pawn pieceId={pieceId} />;
        boardPieceId = "pawn-";
      } else if (idx === 0 || idx === 7) {
        //set pieces in first and last rows
        if (idx2 === 3) {
          piece = <King pieceId={pieceId} />;
          boardPieceId = "king-";
        }
        if (idx2 === 4) {
          piece = <Queen pieceId={pieceId} />;
          boardPieceId = "queen-";
        }
        if (idx2 === 0 || idx2 === 7) {
          piece = <Rook pieceId={pieceId} />;
          boardPieceId = "rook-";
        }
        if (idx2 === 1 || idx2 === 6) {
          piece = <Bishop pieceId={pieceId} />;
          boardPieceId = "bishop-";
        }
        if (idx2 === 2 || idx2 === 5) {
          piece = <Knight pieceId={pieceId} />;
          boardPieceId = "knight-";
        }
      }
      boardPieceId && (boardPieceId += color);
      divs.push(
        <div
          key={`${idx}-${idx2}`}
          id={`${idx}-${idx2}-square`}
          style={{
            ...boxCss,
            backgroundColor: (idx + idx2) % 2 === 1 ? "#ffe4b5" : "#8b4513",
          }}
          onDrop={drop}
          onDragOver={allowDrop}
        >
          {piece}
        </div>
      );
      initialBoard[rowColToBoardIdx(idx, idx2)] = boardPieceId;
    });
  });

  const [board, setBoard] = React.useState(initialBoard);

  function allowDrop(ev: any) {
    ev.preventDefault();
  }

  function drop(ev: any) {
    ev.preventDefault();
    var dragId = ev.dataTransfer.getData("dragId");
    var validSquares = JSON.parse(ev.dataTransfer.getData("validSquares"));
    //var pieceType = ev.dataTransfer.getData("pieceType");

    var dropCell = ev.target.id.slice(0, 3);
    if (validSquares.includes(dropCell)) {
      var pieceEl = document.getElementById(dragId);
      ev.target.appendChild(pieceEl);
      pieceEl && (pieceEl.id = dropCell);

      var enemyKilled = hasEnemyPiece(dragId, dropCell);
      if (enemyKilled) {
        //killEnemyPiece(dropCell, board)
        console.log("Killed: " + enemyKilled);
      }
    }
  }

  const hasEnemyPiece = (dragPieceId: string, dropCell: string) => {
    const dragColor = dragPieceId.split("-")[2];
    const [row, col] = idToCell(dropCell);
    const boardIdx: number = rowColToBoardIdx(row, col);
    const dropPiece = board[boardIdx];
    const dropColor = dropPiece.split("-")[1];
    return dragColor != dropColor ? dropPiece : false;
  };
  /*
  const divs: React.ReactNode[] = [];

  row.forEach((el, idx) => {
    col.forEach((el2, idx2) => {
      let piece: JSX.Element | "" = "";
      var pieceId = `${idx}-${idx2}`;

      if (idx === 1 || idx === 6) {
        piece = <Pawn pieceId={pieceId} />;
      } else if (idx === 0 || idx === 7) {
        //set pieces in first and last rows
        if (idx2 === 2 || idx2 === 5) {
          piece = <Knight pieceId={pieceId} />;
        }
      }
      divs.push(
        <div
          key={`${idx}-${idx2}`}
          id={`${idx}-${idx2}-square`}
          style={boxCss}
          onDrop={drop}
          onDragOver={allowDrop}
        >
          {piece}
        </div>
      );
    });
  });
*/
  return false ? (
    /*
    <PixelGrid
      data={Array(400).fill(0).map(Math.random)}
      options={{
        size: 10,
        padding: 2,
        background: [0, 0.5, 0.7, 1],
      }}
    />
    */
    ""
  ) : (
    //<React.Fragment>
    //<boardContext.Provider value={{updatePiecePos: () => {

    //}}}>
    <div key={0} style={gameBoardCss}>
      {divs}
    </div>
    //</boardContext.Provider>

    /*
      {true ? (
        //<Piece pieceId="test" img="TEST" />
        ""
      ) : (
        <div key={1} id="piece" draggable="true" onDragStart={drag}>
          TEXT
        </div>
      )}
    </React.Fragment>
    */
  );
};
