import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
//import { boardIdxToPieceEl } from "../util/SquareUtil";

import { Board } from "./Board";
import { CustomizedDialogs } from "./dialogs/CheckMateDialog";
//import { PawnUpgrade } from "./PawnUpgrade";

//const client = new W3CWebSocket("ws://localhost:8999");

export const Game = () => {
    const [client, setClient] = React.useState<any>("");
    const [message, setMessage] = React.useState<any>("");

    const [newBoards, setNewBoards] = React.useState<any>([]);
    const [gameNumber, setGameNumber] = React.useState(1);
    //console.log(gameNumber);
    const [gameOver, setGameOver] = React.useState(false);

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
                    setClient(new W3CWebSocket("ws://localhost:8999"));
                    /*
                    client.onopen = () => {
                        console.log("WebSocket Client Connected");
                    };
                    client.onmessage = (message) => {
                        console.log(message);
                    };
                    */
                }}
            >
                Connect To WebSocket
            </button>
            <input type="text" onChange={(e) => setMessage(e.target.value)} />
            <button
                onClick={() => {
                    client.send(message);
                }}
            >
                Send message
            </button>
            <div id="board-container">
                <Board
                    client={client}
                    handleGameOver={() => setGameOver(true)}
                />
            </div>
            <div id="new-board-container">{newBoards}</div>
            <CustomizedDialogs
                open={gameOver}
                setOpen={setGameOver}
                text="Checkmated"
                restartGame={() => {
                    document.getElementById("chess-board-container")?.remove();
                    newBoards.push(
                        <Board
                            client={client}
                            handleGameOver={() => setGameOver(true)}
                        />
                    );
                    setNewBoards(newBoards.slice());

                    setGameNumber(gameNumber + 1);
                }}
            />
            {
                //<PawnUpgrade player="White" />
            }
        </React.Fragment>
    );
};
