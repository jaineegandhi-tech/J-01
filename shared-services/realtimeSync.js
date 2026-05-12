// Real-time synchronization service for admin panel and user app
class RealtimeSync {
  constructor() {
    this.isConnected = false;
    this.listeners = new Map();
    this.init();
  }

  init() {
    // Listen for localStorage changes from other tabs/windows
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Listen for custom events within the same tab
    window.addEventListener('dataSync', this.handleDataSync.bind(this));
    
    this.isConnected = true;
    console.log('RealtimeSync initialized');
  }

  handleStorageChange(event) {
    if (!event.key || !event.key.startsWith('realestate_')) return;
    
    const dataType = event.key.replace('realestate_', '');
    const newData = event.newValue ? JSON.parse(event.newValue) : null;
    
    this.notifyListeners(dataType, newData);
  }

  handleDataSync(event) {
    const { type, data } = event.detail;
    this.notifyListeners(type, data);
  }

  notifyListeners(type, data) {
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in sync listener:', error);
        }
      });
    }
  }

  // Subscribe to data changes
  subscribe(dataType, callback) {
    if (!this.listeners.has(dataType)) {
      this.listeners.set(dataType, new Set());
    }
    this.listeners.get(dataType).add(callback);
    
    return () => {
      this.listeners.get(dataType).delete(callback);
    };
  }

  // Broadcast data changes
  broadcast(type, data) {
    // Trigger custom event for same-tab communication
    window.dispatchEvent(new CustomEvent('dataSync', {
      detail: { type, data }
    }));
    
    // Update localStorage to trigger cross-tab communication
    const key = `realestate_${type}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Specific methods for different data types
  broadcastUserUpdate(users) {
    this.broadcast('users', users);
  }

  broadcastPropertyUpdate(properties) {
    this.broadcast('properties', properties);
  }

  broadcastAgentCreated(agent) {
    this.broadcast('agent_created', agent);
  }

  broadcastAgentUpdated(agent) {
    this.broadcast('agent_updated', agent);
  }

  // Get current data
  getCurrentData(type) {
    const key = `realestate_${type}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Connect method for external usage
  connect() {
    if (!this.isConnected) {
      this.init();
    }
    return this;
  }

  disconnect() {
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('dataSync', this.handleDataSync);
    this.listeners.clear();
    this.isConnected = false;
  }
}

// Create singleton instance
const realtimeSync = new RealtimeSync();

export default realtimeSync;