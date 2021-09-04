import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import { Board } from "./Board";
import { CustomizedDialogs } from "./dialogs/Dialog";
import CRSnackBar from "./SnackBar/SnackBar";

let mode = "production";
mode = "dev";
let url =
    mode === "production"
        ? "wss://protected-thicket-28480.herokuapp.com/:8999"
        : "ws://localhost:8999";
let allowAdminMode = mode === "production" ? false : true;

export const Game = () => {
    const [client, setClient] = React.useState<any>("");
    const [inAdminMode, setInAdminMode] = React.useState(true);

    const [onlineGame, setOnlineGame] = React.useState(false);
    const [joinOnlineSuccess, setJoinOnlineSuccess] = React.useState(false);
    const [snackBarText, setSnackBarText] = React.useState("");

    const [newBoards, setNewBoards] = React.useState<any>([]);
    const [gameNumber, setGameNumber] = React.useState(1);
    //console.log(gameNumber);
    const [gameOver, setGameOver] = React.useState(false);

    const handleGameOver = React.useCallback(() => setGameOver(true), []);

    React.useEffect(() => {
        if (client) {
            client.onopen = () => {
                console.log("WebSocket Client Connected");
                setJoinOnlineSuccess(true);
            };
            client.addEventListener("message", (message: any) => {
                console.log(message);
                if (message.data === "Other Player Joined") {
                    setJoinOnlineSuccess(true);
                    setSnackBarText("Other Player Joined");
                }
            });
        }
    }, [client]);

    React.useEffect(() => {
        if (gameNumber > 1) {
            let boardContainer = document.getElementById("board-container");
            let board = document.getElementById("chess-board-container");
            board && boardContainer?.appendChild(board);
        }
    }, [newBoards, gameNumber]);
    return (
        <React.Fragment>
            <button
                onClick={() => {
                    setOnlineGame(true);
                }}
            >
                Play Online
            </button>
            {allowAdminMode ? (
                <React.Fragment>
                    <br />
                    <button onClick={() => setInAdminMode(!inAdminMode)}>
                        Toggle Admin Mode{" "}
                    </button>
                    {inAdminMode
                        ? "In Admin Mode, can move any piece"
                        : "Not in Admin mode, players must take turns"}
                    <br />
                </React.Fragment>
            ) : (
                ""
            )}
            <div id="board-container">
                <Board client={client} handleGameOver={handleGameOver} />
            </div>
            <div id="new-board-container">{newBoards}</div>
            <CustomizedDialogs
                open={gameOver}
                setOpen={setGameOver}
                title="Game Over"
                text="Checkmated"
                buttonText="Restart Game"
                onButtonClick={() => {
                    document.getElementById("chess-board-container")?.remove();
                    newBoards.push(
                        <Board
                            key={newBoards.length}
                            client={client}
                            handleGameOver={() => setGameOver(true)}
                        />
                    );
                    setNewBoards(newBoards.slice());

                    setGameNumber(gameNumber + 1);
                    setGameOver(false);
                }}
            />
            <CustomizedDialogs
                open={onlineGame}
                setOpen={setOnlineGame}
                title="Play Online"
                text="Room Name"
                input
                buttonText="Join Game"
                onButtonClick={(inputValue) => {
                    setSnackBarText(`Joined Room: ${inputValue}`);
                    setClient(new W3CWebSocket(`${url}?room=${inputValue}`));
                }}
            />
            <CRSnackBar
                open={joinOnlineSuccess}
                setOpen={setJoinOnlineSuccess}
                message={snackBarText}
            />
        </React.Fragment>
    );
};
