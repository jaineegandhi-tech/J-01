// Cross-port synchronization utility
class CrossPortSync {
  constructor() {
    this.syncInterval = null;
    this.isPolling = false;
  }

  // Start polling for cross-port sync data
  startPolling(callback) {
    if (this.isPolling) return;
    
    this.isPolling = true;
    console.log('Starting cross-port sync polling...');
    
    this.syncInterval = setInterval(() => {
      this.checkForSyncData(callback);
    }, 2000); // Check every 2 seconds
  }

  // Stop polling
  stopPolling() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      this.isPolling = false;
      console.log('Cross-port sync polling stopped');
    }
  }

  // Check for new sync data
  checkForSyncData(callback) {
    try {
      const lastCheck = parseInt(localStorage.getItem('admin_last_sync_check') || '0');
      const syncCounter = parseInt(localStorage.getItem('sync_counter') || '0');
      
      console.log('Checking sync - lastCheck:', lastCheck, 'syncCounter:', syncCounter);
      
      if (syncCounter > lastCheck) {
        const latestSync = localStorage.getItem('latest_user_sync');
        console.log('Latest sync data:', latestSync);
        
        if (latestSync) {
          const syncData = JSON.parse(latestSync);
          if (syncData.action === 'user_registered' && syncData.user) {
            console.log('New user registration detected:', syncData.user.email);
            
            // Add user to admin panel
            const adminUsers = JSON.parse(localStorage.getItem('realestate_users') || '[]');
            const userExists = adminUsers.find(u => u.email === syncData.user.email);
            
            if (!userExists) {
              adminUsers.push(syncData.user);
              localStorage.setItem('realestate_users', JSON.stringify(adminUsers));
              console.log('User added to admin panel:', syncData.user.email);
              
              // Notify callback
              if (callback) {
                callback(syncData.user);
              }
            } else {
              console.log('User already exists in admin panel');
            }
          }
        }
        localStorage.setItem('admin_last_sync_check', syncCounter.toString());
      } else {
        console.log('No new sync data available');
      }
    } catch (error) {
      console.log('Cross-port sync check failed:', error);
    }
  }

  // Manual sync check
  syncNow() {
    try {
      const lastCheck = parseInt(localStorage.getItem('admin_last_sync_check') || '0');
      const syncCounter = parseInt(localStorage.getItem('sync_counter') || '0');
      
      console.log('Manual sync - lastCheck:', lastCheck, 'syncCounter:', syncCounter);
      
      if (syncCounter > lastCheck) {
        const latestSync = localStorage.getItem('latest_user_sync');
        if (latestSync) {
          const syncData = JSON.parse(latestSync);
          console.log('Found sync data:', syncData);
          return syncData;
        }
      }
      return null;
    } catch (error) {
      console.log('Manual sync failed:', error);
      return null;
    }
  }
}

export default CrossPortSync;