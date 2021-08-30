import React from "react";
import { King } from "./pieces/King";
import { Queen } from "./pieces/Queen";
import { Pawn } from "./pieces/Pawn";
import { Rook } from "./pieces/Rook";
import { Bishop } from "./pieces/Bishop";
import { Knight } from "./pieces/Knight";

import {
    Player,
    DivId,
    PieceDivId,
    BoardPieceId,
    rowColToBoardIdx,
    divIdToBoardIdx,
    idToCell,
    RowIdx,
    ColIdx,
    getOppositePlayer,
    getPiecesSquareId,
    PieceType,
    boardIdxToId,
} from "../util/SquareUtil";
import { isCheckMate, isInCheck } from "../util/Check";
import { getValidSquaresWithCheck } from "./pieces/Piece";
import { pawnReachedEnd } from "../util/MovesUtil";
import { PawnUpgrade } from "./PawnUpgrade";

export const BoardContext = React.createContext({
    board: [] as any[],
    currPlayer: "White" as Player,
    inMoving: null as any,
    setInMoving: null as any,
});
//const BoardContext = boardContext.Consumer;
//export { boardContext };

export const components: any = {
    King_: King,
    Queen_: Queen,
    Pawn_: Pawn,
    Rook_: Rook,
    Bishop_: Bishop,
    Knight_: Knight,
};

type BoardProps = {
    client: any;
};

export const Board = ({ client }: BoardProps) => {
    const [inAdminMode, setInAdminMode] = React.useState(true);
    const [checkMate, setCheckMate] = React.useState(false);
    const [showPawnUpgrade, setShowPawnUpgrade] = React.useState<any>(false);
    const [upgradedPiece, setUpgradedPiece] = React.useState<any>(null);
    const [currPlayer, setCurrPlayer] = React.useState<Player>("White");

    const [inMoving, setInMoving] = React.useState<PieceDivId | "">("");

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
            let boardPieceId: BoardPieceId = "";
            if (idx === 1 || idx === 6) {
                piece = <Pawn pieceId={pieceId} />;
                boardPieceId = { piece: "Pawn", player: color };
            } else if (idx === 0 || idx === 7) {
                //set pieces in first and last rows
                if (idx2 === 3) {
                    piece = <King pieceId={pieceId} />;
                    boardPieceId = { piece: "King", player: color };
                }
                if (idx2 === 4) {
                    piece = <Queen pieceId={pieceId} />;
                    boardPieceId = { piece: "Queen", player: color };
                }
                if (idx2 === 0 || idx2 === 7) {
                    piece = <Rook pieceId={pieceId} />;
                    boardPieceId = { piece: "Rook", player: color };
                }
                if (idx2 === 1 || idx2 === 6) {
                    piece = <Bishop pieceId={pieceId} />;
                    boardPieceId = { piece: "Bishop", player: color };
                }
                if (idx2 === 2 || idx2 === 5) {
                    piece = <Knight pieceId={pieceId} />;
                    boardPieceId = { piece: "Knight", player: color };
                }
            }
            divs.push(
                <div
                    key={`${idx}-${idx2}`}
                    id={`${idx}-${idx2}-square`}
                    style={{
                        ...boxCss,
                        backgroundColor:
                            (idx + idx2) % 2 === 1 ? "#ffe4b5" : "#8b4513",
                    }}
                    onDrop={drop}
                    onDragOver={allowDrop}
                    onClick={(ev: any) => {
                        if (!inMoving) return;
                        const movingSquareId = getPiecesSquareId(inMoving);
                        if (!movingSquareId) return;
                        const boardIdx = divIdToBoardIdx(movingSquareId);
                        var validSquares = getValidSquaresWithCheck(
                            boardIdx,
                            board
                        );
                        movePiece(
                            ev.target,
                            inMoving as PieceDivId,
                            validSquares
                        );
                        setInMoving("");
                    }}
                >
                    {piece}
                </div>
            );
            initialBoard[rowColToBoardIdx(idx as RowIdx, idx2 as ColIdx)] =
                boardPieceId;
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

        var squareEl = ev.target.id.includes("square")
            ? ev.target
            : ev.target.parentElement;
        movePiece(squareEl, dragId, validSquares);
    }
    const placePiece = React.useCallback(
        (
            newSquareDiv: any,
            pieceEl: any,
            dropCell: any,
            origSquareId: any,
            player: any
        ) => {
            newSquareDiv.appendChild(pieceEl);
            var newBoard = board;
            const origPieceType =
                board[divIdToBoardIdx(origSquareId)] &&
                board[divIdToBoardIdx(origSquareId)].piece;
            newBoard[divIdToBoardIdx(origSquareId)] = "";
            newBoard[divIdToBoardIdx(dropCell)] = {
                piece: origPieceType,
                player: player,
            };
            setBoard(newBoard);
            /*
    setBoard((prevBoard) => {
      var newBoard = prevBoard;
      const dragPieceType =
        prevBoard[divIdToBoardIdx(dragId)] &&
        prevBoard[divIdToBoardIdx(dragId)].piece;
      newBoard[divIdToBoardIdx(dragId)] = "";
      newBoard[divIdToBoardIdx(dropCell)] = {
        piece: dragPieceType,
        player: draggedPlayer,
      };
      return newBoard;
    });
    */
        },
        [board]
    );

    const hasEnemyPiece = React.useCallback(
        (dragPieceId: string, dropCell: DivId) => {
            const dragColor = dragPieceId.split("-")[2];
            const [row, col] = idToCell(dropCell);
            const boardIdx: number = rowColToBoardIdx(row, col);
            const dropPiece: BoardPieceId = board[boardIdx];
            const dropColor = dropPiece && dropPiece.player;
            return dragColor !== dropColor ? dropPiece : false;
        },
        [board]
    );
    const movePiece = React.useCallback(
        (
            squareEl: any,
            dragId: PieceDivId,
            validSquares: DivId[],
            fromOther?: boolean
        ) => {
            var dropCell = squareEl.id.slice(0, 3);
            if (validSquares.includes(dropCell)) {
                var pieceEl = document.getElementById(dragId);
                var draggedPlayer = dragId.split("-")[2];
                if (currPlayer !== draggedPlayer && !inAdminMode) {
                    return;
                }
                const oldSquareDivId = getPiecesSquareId(dragId) as DivId;
                var enemyKilled = hasEnemyPiece(dragId, dropCell);
                if (enemyKilled) {
                    //var enemyParentDiv = squareEl.parentElement;
                    var enemyParentDiv = squareEl;
                    killPiece(enemyKilled, enemyParentDiv.children[0].id);
                    placePiece(
                        enemyParentDiv,
                        pieceEl,
                        dropCell,
                        oldSquareDivId,
                        draggedPlayer
                    );
                } else {
                    placePiece(
                        squareEl,
                        pieceEl,
                        dropCell,
                        oldSquareDivId,
                        draggedPlayer
                    );
                }
                setCurrPlayer(getOppositePlayer(currPlayer));
                if (client && !fromOther) {
                    var message = {
                        squareElId: squareEl.id,
                        dragId: dragId,
                        validSquares: validSquares,
                    };
                    client.send(`broadcast:${JSON.stringify(message)}`);
                }
            }
        },
        [client, currPlayer, hasEnemyPiece, inAdminMode, placePiece]
    );

    const killPiece = (boardPieceId: BoardPieceId, pieceId: PieceDivId) => {
        if (boardPieceId) {
            const pieceEl = document.getElementById(pieceId);
            pieceEl && pieceEl.remove();
        }
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
    React.useEffect(() => {
        setCheckMate(isCheckMate(currPlayer, board));
        var pawnNeedsUpgrade = pawnReachedEnd(board);
        if (pawnNeedsUpgrade) {
            setShowPawnUpgrade(pawnNeedsUpgrade);
        }
    }, [currPlayer, board]);

    React.useEffect(() => {
        if (client) {
            client.onmessage = (message: any) => {
                console.log(message);
                if (message.data) {
                    var movePieceParams =
                        message.data.split("broadcast:") &&
                        message.data.split("broadcast:")[1];
                    movePieceParams = JSON.parse(movePieceParams);
                    if (movePieceParams) {
                        movePieceParams.squareEl = document.getElementById(
                            movePieceParams.squareElId
                        );
                        movePiece(
                            movePieceParams.squareEl,
                            movePieceParams.dragId,
                            movePieceParams.validSquares,
                            true
                        );
                    }
                }
            };
        }
    }, [client, movePiece]);

    React.useEffect(() => {
        if (upgradedPiece) {
            var pieceDivEl = document.getElementById(
                upgradedPiece.props.pieceId
            );
            var squareEl = document.getElementById(
                upgradedPiece.props.pieceId.split("squareDivId-")[1]
            );
            pieceDivEl && squareEl?.appendChild(pieceDivEl);
        }
    }, [upgradedPiece]);

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
        <div>test</div>
    ) : (
        //<React.Fragment>
        //<boardContext.Provider value={{updatePiecePos: () => {

        //}}}>
        <BoardContext.Provider
            value={{
                board: board,
                currPlayer: currPlayer,
                inMoving: inMoving,
                setInMoving: setInMoving,
            }}
        >
            <React.Fragment>
                <button onClick={() => setInAdminMode(!inAdminMode)}>
                    Toggle Admin Mode{" "}
                </button>
                {inAdminMode
                    ? "In Admin Mode, can move any piece"
                    : "Not in Admin mode, players must take turns"}
                <br />
                {`${currPlayer}'s turn`}
                {isInCheck(currPlayer, board) ? (
                    <div>{currPlayer} IS IN CHECK</div>
                ) : (
                    <br />
                )}
                {checkMate ? <div>{currPlayer} IS IN CHECKMATE!!</div> : <br />}
                <div key={0} style={gameBoardCss}>
                    {divs}
                </div>
                {showPawnUpgrade ? (
                    <PawnUpgrade
                        player={getOppositePlayer(currPlayer)}
                        onUpgradeSelect={(piece: PieceType) => {
                            var pawnsIdx =
                                showPawnUpgrade && showPawnUpgrade.idx;
                            var squareDivId = boardIdxToId(pawnsIdx);
                            var squareEl = document.getElementById(squareDivId);
                            var pawnEl = squareEl && squareEl.children[0];
                            var origPawnId = pawnEl && pawnEl.id;

                            pawnEl && pawnEl.remove();

                            setUpgradedPiece(
                                React.createElement(components[`${piece}_`], {
                                    pieceId: `${origPawnId}-${piece}-squareDivId-${
                                        squareEl && squareEl.id
                                    }`,
                                })
                            );

                            //update board state
                            var copy = JSON.parse(JSON.stringify(board));
                            copy[pawnsIdx] = {
                                ...showPawnUpgrade,
                                piece: piece,
                            };
                            setBoard(copy);
                        }}
                    />
                ) : (
                    ""
                )}
                {upgradedPiece}
            </React.Fragment>
        </BoardContext.Provider>

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
