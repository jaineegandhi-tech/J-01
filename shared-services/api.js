class SharedAPIService {
  constructor() {
    this.baseURL = 'http://localhost:3001/api';
    this.ws = null;
    this.subscribers = new Map();
  }

  initWebSocket() {
    this.ws = new WebSocket('ws://localhost:3001/ws');
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers(data.type, data.payload);
    };
  }

  subscribe(type, callback) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, []);
    }
    this.subscribers.get(type).push(callback);
  }

  notifySubscribers(type, data) {
    if (this.subscribers.has(type)) {
      this.subscribers.get(type).forEach(callback => callback(data));
    }
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    return response.json();
  }

  async getAgents(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/agents?${params}`);
  }

  async createAgent(agentData) {
    const result = await this.request('/agents', {
      method: 'POST',
      body: JSON.stringify(agentData)
    });
    
    if (this.ws) {
      this.ws.send(JSON.stringify({ type: 'AGENT_CREATED', payload: result }));
    }
    return result;
  }

  async updateAgent(id, agentData) {
    const result = await this.request(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agentData)
    });
    
    if (this.ws) {
      this.ws.send(JSON.stringify({ type: 'AGENT_UPDATED', payload: result }));
    }
    return result;
  }

  async getProperties(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/properties?${params}`);
  }

  async createProperty(propertyData) {
    const result = await this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData)
    });
    
    if (this.ws) {
      this.ws.send(JSON.stringify({ type: 'PROPERTY_CREATED', payload: result }));
    }
    return result;
  }
}

export default new SharedAPIService();