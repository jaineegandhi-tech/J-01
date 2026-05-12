// Shared localStorage database for user management
class LocalDatabase {
  constructor() {
    this.USERS_KEY = 'realestate_users';
    this.COUNTER_KEY = 'realestate_user_counter';
    this.initializeDatabase();
  }

  initializeDatabase() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.COUNTER_KEY)) {
      localStorage.setItem(this.COUNTER_KEY, '1000');
    }
  }

  generateUserId() {
    const counter = parseInt(localStorage.getItem(this.COUNTER_KEY)) + 1;
    localStorage.setItem(this.COUNTER_KEY, counter.toString());
    return counter;
  }

  getAllUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  addUser(userData) {
    const users = this.getAllUsers();
    const newUser = {
      id: this.generateUserId(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return newUser;
  }

  updateUser(id, userData) {
    const users = this.getAllUsers();
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      users[index] = { ...users[index], ...userData, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return users[index];
    }
    return null;
  }

  getUserByEmail(email) {
    const users = this.getAllUsers();
    return users.find(user => user.email === email);
  }

  deleteUser(id) {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== parseInt(id));
    localStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers));
    return true;
  }
}

export default new LocalDatabase();