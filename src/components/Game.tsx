import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import { Board } from "./Board";
import { CustomizedDialogs } from "./dialogs/Dialog";
import CRSnackBar from "./SnackBar/SnackBar";

let url = "ws://localhost:8999";
//url = "wss://protected-thicket-28480.herokuapp.com/:8999";

export const Game = () => {
    const [client, setClient] = React.useState<any>("");

    const [onlineGame, setOnlineGame] = React.useState(false);
    const [joinOnlineSuccess, setJoinOnlineSuccess] = React.useState(false);
    const [room, setRoom] = React.useState("");

    const [newBoards, setNewBoards] = React.useState<any>([]);
    const [gameNumber, setGameNumber] = React.useState(1);
    //console.log(gameNumber);
    const [gameOver, setGameOver] = React.useState(false);

    const handleGameOver = React.useCallback(() => setGameOver(true), []);

    React.useEffect(() => {
        if (client) {
            client.onopen = (message: any) => {
                console.log("WebSocket Client Connected");
                setJoinOnlineSuccess(true);
            };
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
                    setRoom(inputValue);
                    setClient(new W3CWebSocket(`${url}?room=${inputValue}`));
                }}
            />
            <CRSnackBar
                open={joinOnlineSuccess}
                setOpen={setJoinOnlineSuccess}
                message={`Joined Room: ${room}`}
            />
        </React.Fragment>
    );
};
