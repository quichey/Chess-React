"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var exports = {};
exports.__esModule = true;
//require("express")
var express_1 = __importDefault(require("express"));
var http = __importStar(require("http"));
var WebSocket = __importStar(require("ws"));
var app = (0, express_1["default"])();
//initialize a simple http server
var server = http.createServer(app);
//initialize the WebSocket server instance
var wss = new WebSocket.Server({ server: server });
wss.on("connection", function (ws) {
    //connection is up, let's add a simple simple event
    ws.on("message", function (message) {
        //log the received message and send it back to the client
        console.log("received: %s", message);
        ws.send("Hello, you sent -> " + message);
    });
    //send immediatly a feedback to the incoming connection
    ws.send("Hi there, I am a WebSocket server");
});
//start our server
server.listen(process.env.PORT || 8999, function () {
    var serverAddress = server && server.address && server.address();
    console.log("Server started on port " + (serverAddress && serverAddress.port) + " :)");
});
