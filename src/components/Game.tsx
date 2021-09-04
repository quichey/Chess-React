import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
//import { boardIdxToPieceEl } from "../util/SquareUtil";

import { Board } from "./Board";
import { CustomizedDialogs } from "./dialogs/Dialog";
//import { PawnUpgrade } from "./PawnUpgrade";

let url = "ws://localhost:8999";
url = "wss://protected-thicket-28480.herokuapp.com/:8999";
//const client = new W3CWebSocket("ws://localhost:8999");

export const Game = () => {
    const [client, setClient] = React.useState<any>("");

    const [onlineGame, setOnlineGame] = React.useState(false);

    const [newBoards, setNewBoards] = React.useState<any>([]);
    const [gameNumber, setGameNumber] = React.useState(1);
    //console.log(gameNumber);
    const [gameOver, setGameOver] = React.useState(false);

    const handleGameOver = React.useCallback(() => setGameOver(true), []);

    React.useEffect(() => {
        if (client) {
            client.onopen = () => {
                console.log("WebSocket Client Connected");
            };
            /*
            client.onmessage = (message: any) => {
                console.log(message);
            };
            */
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
                    setClient(new W3CWebSocket(`${url}?room=${inputValue}`));
                }}
            />
            {
                //<PawnUpgrade player="White" />
            }
        </React.Fragment>
    );
};
