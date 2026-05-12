// Sync manager for cross-application data synchronization
class SyncManager {
  constructor() {
    this.listeners = new Map();
    this.lastSync = Date.now();
    this.startPolling();
  }

  // Add listener for data changes
  addListener(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
  }

  // Remove listener
  removeListener(key, callback) {
    if (this.listeners.has(key)) {
      const callbacks = this.listeners.get(key);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Check for changes and notify listeners
  checkForChanges() {
    const currentTime = Date.now();
    
    // Check users data
    const usersData = localStorage.getItem('realestate_users');
    if (usersData) {
      const users = JSON.parse(usersData);
      const hasNewUsers = users.some(user => {
        const createdAt = new Date(user.createdAt || user.joinDate).getTime();
        return createdAt > this.lastSync;
      });
      
      if (hasNewUsers) {
        this.notifyListeners('realestate_users', users);
      }
    }
    
    this.lastSync = currentTime;
  }

  // Notify all listeners for a key
  notifyListeners(key, data) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Sync listener error:', error);
        }
      });
    }
  }

  // Start polling for changes
  startPolling() {
    setInterval(() => {
      this.checkForChanges();
    }, 2000); // Check every 2 seconds
  }
}

export default new SyncManager();