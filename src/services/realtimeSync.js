class RealtimeSyncService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    try {
      this.ws = new WebSocket('ws://localhost:3001/ws');
      
      this.ws.onopen = () => {
        console.log('Realtime sync connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        this.reconnect();
      };
    } catch (error) {
      console.error('Failed to connect to realtime sync:', error);
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), 3000);
    }
  }

  broadcastAgentCreated(agent) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'AGENT_CREATED',
        payload: agent
      }));
    }
  }

  broadcastAgentUpdated(agent) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'AGENT_UPDATED',
        payload: agent
      }));
    }
  }

  broadcastPropertyCreated(property) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'PROPERTY_CREATED',
        payload: property
      }));
    }
  }
}

export default new RealtimeSyncService();