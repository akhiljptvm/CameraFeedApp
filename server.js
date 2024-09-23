const WebSocket = require('ws');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 8080 });
let SampleText = "Successfully Data Arrived......";


wss.on('connection', (ws) => {
  console.log('Client connected.');

  ws.on('message', (message) => {
    // Check if the received message is binary
    if (Buffer.isBuffer(message)) {
      console.log('Received binary message of length:', message.length);
      
      // Broadcast the received binary data to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          // client.send(message); // Sending the binary data to other clients
          client.send(SampleText);
        }
      });
    } else {
      console.log('Received non-binary message:', message);
    }
  });


  

  ws.on('close', () => {
    console.log('Client disconnected.');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');