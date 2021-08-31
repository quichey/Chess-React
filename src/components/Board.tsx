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
    Move,
    boardIdxToPieceEl,
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
    prevMove: "" as Move,
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
    handleGameOver?: () => void;
};

export const Board = ({ client, handleGameOver }: BoardProps) => {
    const [inAdminMode, setInAdminMode] = React.useState(true);
    const [checkMate, setCheckMate] = React.useState(false);
    const [showPawnUpgrade, setShowPawnUpgrade] = React.useState<any>(false);
    //const [pawnUpgradeComp, setPawnUpgradeComp] = React.useState<any>(null);
    const [upgradedPieces, setUpgradedPieces] = React.useState<any>([]);
    const [currPlayer, setCurrPlayer] = React.useState<Player>("White");
    const [prevMove, setPrevMove] = React.useState<Move>("");

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
                pieceId += "-Pawn";
                piece = <Pawn pieceId={pieceId} />;
                boardPieceId = { piece: "Pawn", player: color };
            } else if (idx === 0 || idx === 7) {
                //set pieces in first and last rows
                if (idx2 === 3) {
                    pieceId += "-King";
                    piece = <King pieceId={pieceId} />;
                    boardPieceId = { piece: "King", player: color };
                }
                if (idx2 === 4) {
                    pieceId += "-Queen";
                    piece = <Queen pieceId={pieceId} />;
                    boardPieceId = { piece: "Queen", player: color };
                }
                if (idx2 === 0 || idx2 === 7) {
                    pieceId += "-Rook";
                    piece = <Rook pieceId={pieceId} />;
                    boardPieceId = { piece: "Rook", player: color };
                }
                if (idx2 === 1 || idx2 === 6) {
                    pieceId += "-Bishop";
                    piece = <Bishop pieceId={pieceId} />;
                    boardPieceId = { piece: "Bishop", player: color };
                }
                if (idx2 === 2 || idx2 === 5) {
                    pieceId += "-Knight";
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
                            board,
                            prevMove
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

        var squareEl =
            ev.target.id.includes("square") &&
            !ev.target.id.includes("squareDivId")
                ? ev.target
                : ev.target.parentElement;
        movePiece(squareEl, dragId, validSquares);
    }
    const placePiece = React.useCallback(
        (newSquareDiv: any, pieceEl: any) => {
            if (!pieceEl || !newSquareDiv) return;

            let origSquareId = getPiecesSquareId(pieceEl.id);
            if (!origSquareId) return;

            var newBoard = board;
            const origPieceType =
                board[divIdToBoardIdx(origSquareId)] &&
                board[divIdToBoardIdx(origSquareId)].piece;
            newBoard[divIdToBoardIdx(origSquareId)] = "";

            newBoard[divIdToBoardIdx(newSquareDiv.id)] = {
                piece: origPieceType,
                player: pieceEl.id.split("-")[2],
            };

            setBoard(newBoard);
            newSquareDiv.appendChild(pieceEl);
            setPrevMove({
                pieceType: origPieceType,
                player: pieceEl.id.split("-")[2],
                oldBoardIdx: divIdToBoardIdx(origSquareId),
                newBoardIdx: divIdToBoardIdx(newSquareDiv.id),
            });
            //console.log(prevMove)
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
            let validSquaresRowCol = validSquares.map((id) => {
                return id.slice(0, 3);
            });
            if (validSquaresRowCol.includes(dropCell)) {
                var pieceEl = document.getElementById(dragId);
                var draggedPlayer = dragId.split("-")[2];
                if (currPlayer !== draggedPlayer && !inAdminMode) {
                    return;
                }
                var enemyKilled = hasEnemyPiece(dragId, dropCell);
                if (enemyKilled) {
                    //var enemyParentDiv = squareEl.parentElement;
                    var enemyParentDiv = squareEl;
                    killPiece(enemyParentDiv.children[0].id);
                }
                placePiece(squareEl, pieceEl);

                //do Castle

                if (
                    validSquares
                        .find((id) => {
                            return id.includes(dropCell);
                        })
                        ?.includes("castle")
                ) {
                    //if (dragId.includes("King")) {
                    let dropColl = Number(dropCell.charAt(2));
                    let kingColl = Number(dragId.charAt(2));
                    let kingRow = Number(dragId.charAt(0));
                    if (Math.abs(dropColl - kingColl) === 2) {
                        let castleLeft = kingColl > dropColl;
                        let rookDivId = castleLeft
                            ? `${kingRow}-0-${draggedPlayer}-Rook`
                            : `${kingRow}-7-${draggedPlayer}-Rook`;
                        let dropRookDivId = castleLeft
                            ? `${kingRow}-${dropColl + 1}-square`
                            : `${kingRow}-${dropColl - 1}-square`;

                        let newRookSquareEl =
                            document.getElementById(dropRookDivId);
                        let rookEl = document.getElementById(rookDivId);
                        placePiece(newRookSquareEl, rookEl);
                    }
                }

                //do En Passant
                if (
                    validSquares
                        .find((id) => {
                            return id.includes(dropCell);
                        })
                        ?.includes("enpassant")
                ) {
                    let prevPawn =
                        prevMove && boardIdxToPieceEl(prevMove.newBoardIdx);
                    prevPawn && killPiece(prevPawn.id as PieceDivId);
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
        [client, currPlayer, hasEnemyPiece, inAdminMode, placePiece, prevMove]
    );

    const killPiece = (pieceId: PieceDivId) => {
        const pieceEl = document.getElementById(pieceId);
        pieceEl && pieceEl.remove();
    };

    React.useEffect(() => {
        setCheckMate(isCheckMate(currPlayer, board));
        var pawnNeedsUpgrade = pawnReachedEnd(board);
        if (pawnNeedsUpgrade) {
            setShowPawnUpgrade(pawnNeedsUpgrade);
        }
    }, [currPlayer, board]);

    React.useEffect(() => {
        if (showPawnUpgrade) {
            var upgradeEl = document.getElementById("pawn-upgrade");
            var pawnsIdx = showPawnUpgrade && showPawnUpgrade.idx;
            var squareDivId = boardIdxToId(pawnsIdx);
            var squareEl = document.getElementById(squareDivId);
            upgradeEl && squareEl?.appendChild(upgradeEl);
        }
    }, [showPawnUpgrade]);

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
        if (upgradedPieces.length > 0) {
            var newUpgraded = upgradedPieces[upgradedPieces.length - 1];
            var pieceDivEl = document.getElementById(newUpgraded.props.pieceId);
            var squareEl = document.getElementById(
                newUpgraded.props.pieceId.split("squareDivId-")[1]
            );
            pieceDivEl && squareEl?.appendChild(pieceDivEl);
        }
    }, [upgradedPieces]);

    React.useEffect(() => {
        if (checkMate) {
            handleGameOver && handleGameOver();
        }
    }, [checkMate, handleGameOver]);

    return false ? (
        <div>test</div>
    ) : (
        <BoardContext.Provider
            value={{
                board: board,
                currPlayer: currPlayer,
                inMoving: inMoving,
                setInMoving: setInMoving,
                prevMove: prevMove,
            }}
        >
            <React.Fragment>
                <div id="chess-board-container">
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
                    {checkMate ? (
                        <div>{currPlayer} IS IN CHECKMATE!!</div>
                    ) : (
                        <br />
                    )}
                    <div key={0} style={gameBoardCss} id="chess-board">
                        {divs}
                    </div>
                </div>

                <div id="pawn-upgrade-container">
                    {showPawnUpgrade ? (
                        <PawnUpgrade
                            player={showPawnUpgrade.player}
                            side={showPawnUpgrade.idx < 30 ? "top" : "bottom"}
                            onUpgradeSelect={(piece: PieceType) => {
                                var pawnsIdx =
                                    showPawnUpgrade && showPawnUpgrade.idx;
                                var squareDivId = boardIdxToId(pawnsIdx);
                                var squareEl =
                                    document.getElementById(squareDivId);
                                var pawnEl =
                                    squareEl &&
                                    Array.from(squareEl.children)?.find(
                                        (el) => {
                                            return (
                                                el &&
                                                !el.id.includes("pawn-upgrade")
                                            );
                                        }
                                    );
                                var origPawnId = pawnEl && pawnEl.id;

                                pawnEl && pawnEl.remove();

                                setUpgradedPieces(
                                    upgradedPieces.concat([
                                        React.createElement(
                                            components[`${piece}_`],
                                            {
                                                pieceId: `${origPawnId}-${piece}-squareDivId-${
                                                    squareEl && squareEl.id
                                                }`,
                                                key: upgradedPieces.length,
                                            }
                                        ),
                                    ])
                                );

                                //update board state
                                var copy = JSON.parse(JSON.stringify(board));
                                copy[pawnsIdx] = {
                                    ...showPawnUpgrade,
                                    piece: piece,
                                };
                                setBoard(copy);
                                var pawnUpgradeEl =
                                    document.getElementById("pawn-upgrade");
                                //pawnUpgradeEl && pawnUpgradeEl?.remove();
                                //pawnUpgradeEl &&
                                //    squareEl?.removeChild(pawnUpgradeEl);
                                var pawnUpgradeContainer =
                                    document.getElementById(
                                        "pawn-upgrade-container"
                                    );
                                pawnUpgradeEl &&
                                    pawnUpgradeContainer?.appendChild(
                                        pawnUpgradeEl
                                    );
                                setShowPawnUpgrade(null);
                            }}
                        />
                    ) : (
                        ""
                    )}
                </div>
                {upgradedPieces.map((piece: any, idx: number) => {
                    return (
                        <div key={idx} onDrop={drop} onDragOver={allowDrop}>
                            {piece}
                        </div>
                    );
                })}
            </React.Fragment>
        </BoardContext.Provider>
    );
};
