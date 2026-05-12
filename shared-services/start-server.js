const WebSocketServer = require('./websocket-server');

// Start WebSocket server
const wsServer = new WebSocketServer(3001);
wsServer.start();

console.log('Real-time sync server started on port 3001');