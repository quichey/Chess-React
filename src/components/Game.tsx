import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import { Board } from "./Board";

//const client = new W3CWebSocket("ws://localhost:8999");

export const Game = () => {
    const [client, setClient] = React.useState<any>("");

    React.useEffect(() => {
        if (client) {
            client.onopen = () => {
                console.log("WebSocket Client Connected");
            };
            client.onmessage = (message: any) => {
                console.log(message);
            };
        }
    }, [client]);
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
            <Board />
        </React.Fragment>
    );
};
