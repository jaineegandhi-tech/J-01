const WebSocket = require('ws');
const http = require('http');

class WebSocketServer {
  constructor(port = 3001) {
    this.port = port;
    this.server = http.createServer();
    this.wss = new WebSocket.Server({ server: this.server });
    this.clients = new Set();
    
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('Client connected');
      this.clients.add(ws);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.broadcast(data);
        } catch (error) {
          console.error('Invalid message format:', error);
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
  }

  broadcast(data) {
    const message = JSON.stringify(data);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Broadcast specific events
  broadcastAgentCreated(agent) {
    this.broadcast({ type: 'AGENT_CREATED', payload: agent });
  }

  broadcastAgentUpdated(agent) {
    this.broadcast({ type: 'AGENT_UPDATED', payload: agent });
  }

  broadcastPropertyCreated(property) {
    this.broadcast({ type: 'PROPERTY_CREATED', payload: property });
  }

  broadcastPropertyUpdated(property) {
    this.broadcast({ type: 'PROPERTY_UPDATED', payload: property });
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`WebSocket server running on port ${this.port}`);
    });
  }
}

module.exports = WebSocketServer;