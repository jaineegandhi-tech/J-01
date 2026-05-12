// Simple sync service for cross-port communication
window.SyncService = {
  readLatestUser: function() {
    try {
      const user = localStorage.getItem('latest_registered_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  
  checkForNewUsers: function() {
    try {
      const timestamp = localStorage.getItem('user_registration_timestamp');
      const lastCheck = localStorage.getItem('admin_last_check_timestamp') || '0';
      
      if (timestamp && parseInt(timestamp) > parseInt(lastCheck)) {
        localStorage.setItem('admin_last_check_timestamp', timestamp);
        return this.readLatestUser();
      }
      return null;
    } catch {
      return null;
    }
  }
};