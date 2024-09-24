var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000; // Use assigned port from Render or fallback to 8080 for local testing

var http = require('http').createServer(app);
// var io = require('socket.io')(http, {allowEIO3: true, allowEIO4: true, serveClient: true});

var io = require('socket.io')(http, {
  allowEIO3: true,
  allowEIO4: true,
  serveClient: true,
  cors: { origin: '*'}
});

http.listen(port, function(){ console.log('listening on *:3000');});

var serverID = 'undefined';
io.on('connection', function (socket){
    console.log('a user connected: ' + socket.id + " (server: " + serverID + " )");
    //register the server id, received the command from unity
    socket.on('RegServerId', function (data){
        serverID = socket.id;
        console.log('reg server id : ' + serverID);
    });

    socket.on('disconnect', function(){
        if (serverID == socket.id)
        {
           serverID = 'undefined';
           console.log('removed Server: ' + socket.id);
        }
        else
        {
           console.log('user disconnected: ' + socket.id);
        }
    });

    socket.on('OnReceiveData', function (data){
        if (serverID != 'undefined')
        {
            switch(data.EmitType)
            {
                //emit type: all;
                case 0: io.emit('OnReceiveData', { DataString: data.DataString, DataByte: data.DataByte }); break;
                //emit type: server;
                case 1: io.to(serverID).emit('OnReceiveData', { DataString: data.DataString, DataByte: data.DataByte }); break;
                //emit type: others;
                case 2: socket.broadcast.emit('OnReceiveData', { DataString: data.DataString, DataByte: data.DataByte }); break;
            }
        }
        else
        {
            console.log('cannot find any active server');
        }
    });
});
























// const WebSocket = require('ws');
// const fs = require('fs');

// const port = process.env.PORT || 8080; // Use assigned port from Render or fallback to 8080 for local testing
// const wss = new WebSocket.Server({ port });
// // let SampleText = "Successfully Data Arrived......";


// wss.on('connection', (ws) => {
//   console.log('Client connected.');

//   ws.on('message', (message) => {
//     // Check if the received message is binary
//     if (Buffer.isBuffer(message)) {
//       console.log('Received binary message of length:', message.length);
      
//       // Broadcast the received binary data to all connected clients
//       wss.clients.forEach((client) => {
//         if (client !== ws && client.readyState === WebSocket.OPEN) {
//           client.send(message); // Sending the binary data to other clients
//           // client.send(SampleText);
          
//         }
//       });
//     } else {
//       console.log('Received non-binary message:', message);
//     }
//   });




//   ws.on('close', () => {
//     console.log('Client disconnected.');
//   });
// });

// console.log('WebSocket server is running on ${port}');




