import React from "react";
import { King } from "./pieces/King";
import { Queen } from "./pieces/Queen";
import { Pawn } from "./pieces/Pawn";
import { Rook } from "./pieces/Rook";
import { Bishop } from "./pieces/Bishop";
import { Knight } from "./pieces/Knight";

export const BattleGrid = () => {
  const col = new Array(8);
  col.fill(100);
  const row = new Array(8);
  row.fill(100);
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

  row.forEach((el, idx) => {
    col.forEach((el2, idx2) => {
      let piece: JSX.Element | "" = "";
      let color: "White" | "Black" = idx > 3 ? "White" : "Black";
      var pieceId = `${idx}-${idx2}-${color}`;
      if (idx === 1 || idx === 6) {
        piece = <Pawn pieceId={pieceId} />;
      } else if (idx === 0 || idx === 7) {
        //set pieces in first and last rows
        if (idx2 === 3) {
          piece = <King pieceId={pieceId} />;
        }
        if (idx2 === 4) {
          piece = <Queen pieceId={pieceId} />;
        }
        if (idx2 === 0 || idx2 === 7) {
          piece = <Rook pieceId={pieceId} />;
        }
        if (idx2 === 1 || idx2 === 6) {
          piece = <Bishop pieceId={pieceId} />;
        }
        if (idx2 === 2 || idx2 === 5) {
          piece = <Knight pieceId={pieceId} />;
        }
      }
      initialBoard[idx * 8 + idx2] = (
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
    }
  }
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
      {board}
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
