const express = require('express')
const app = express()
const port = 3000
const WebSocket = require('ws')
const http = require('http')

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

	//log the received message and send it back to the client
        console.log('received: %s', message);

        const broadcastRegex = /^broadcast\:/;

        if (broadcastRegex.test(message)) {
            //message = message.replace(broadcastRegex, '');

            //send back the message to the other clients
            wss.clients
                .forEach(client => {
                    if (client != ws) {
                        client.send(`Hello, broadcast message -> ${message}`);
                    }    
                });
            
        } else {
            ws.send(`Hello, you sent -> ${message}`);
        }

        //log the received message and send it back to the client
        //console.log('received: %s', message);
        //ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

/*

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
*/
