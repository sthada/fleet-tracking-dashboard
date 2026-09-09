import { WebSocketServer } from 'ws';

// Start the server on port 8080
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('A client connected!');

  // Listen for messages from the client
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    ws.send(`Echo: ${message}`); // Send data back
  });

  ws.send('Welcome to the WebSocket server!'); 
});