const fs = require('fs');
const path = require('path');

const SHARED_FILE = path.join(__dirname, '../../../shared-data.json');

class SharedStorage {
  static readData() {
    try {
      if (fs.existsSync(SHARED_FILE)) {
        const data = fs.readFileSync(SHARED_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading shared data:', error);
    }
    return { users: [], properties: [], lastSync: null };
  }

  static writeData(data) {
    try {
      fs.writeFileSync(SHARED_FILE, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing shared data:', error);
      return false;
    }
  }

  static addUser(user) {
    const data = this.readData();
    data.users.push({ ...user, syncedAt: Date.now() });
    data.lastSync = Date.now();
    return this.writeData(data);
  }

  static getNewUsers(lastCheck = 0) {
    const data = this.readData();
    return data.users.filter(user => (user.syncedAt || 0) > lastCheck);
  }
}

export default SharedStorage;