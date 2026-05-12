const Database = require('better-sqlite3');
const path = require('path');

class RealEstateDB {
  constructor() {
    const dbPath = path.join(process.cwd(), 'realestate.db');
    this.db = new Database(dbPath);
    this.initializeTables();
    this.seedData();
  }

  initializeTables() {
    // Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        role TEXT NOT NULL CHECK (role IN ('admin', 'agent', 'buyer', 'seller', 'landlord', 'tenant')),
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
        joinDate TEXT NOT NULL,
        lastLogin TEXT,
        propertiesCount INTEGER DEFAULT 0,
        avatar TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Properties table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('apartment', 'house', 'villa', 'townhouse', 'condo', 'studio', 'penthouse', 'duplex', 'commercial', 'land')),
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'rented', 'inactive')),
        price REAL NOT NULL,
        location TEXT NOT NULL,
        bedrooms INTEGER DEFAULT 0,
        bathrooms INTEGER DEFAULT 0,
        area REAL NOT NULL,
        description TEXT,
        agentId INTEGER,
        ownerId INTEGER,
        views INTEGER DEFAULT 0,
        inquiries INTEGER DEFAULT 0,
        images TEXT,
        features TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agentId) REFERENCES users(id),
        FOREIGN KEY (ownerId) REFERENCES users(id)
      )
    `);

    // Transactions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        propertyId INTEGER NOT NULL,
        propertyTitle TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('sale', 'rent', 'lease')),
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
        amount REAL NOT NULL,
        buyerId INTEGER,
        sellerId INTEGER,
        agentId INTEGER,
        commission REAL DEFAULT 0,
        date TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (propertyId) REFERENCES properties(id),
        FOREIGN KEY (buyerId) REFERENCES users(id),
        FOREIGN KEY (sellerId) REFERENCES users(id),
        FOREIGN KEY (agentId) REFERENCES users(id)
      )
    `);

    // Inquiries table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        propertyId INTEGER NOT NULL,
        property TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('Sale', 'Rent')),
        status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Responded', 'Closed')),
        priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
        message TEXT,
        date TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (propertyId) REFERENCES properties(id)
      )
    `);

    // Payments table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transactionId INTEGER,
        propertyId INTEGER,
        userId INTEGER,
        amount REAL NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('commission', 'deposit', 'rent', 'sale', 'fee')),
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
        method TEXT CHECK (method IN ('credit_card', 'bank_transfer', 'cash', 'check')),
        reference TEXT,
        date TEXT NOT NULL,
        dueDate TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (transactionId) REFERENCES transactions(id),
        FOREIGN KEY (propertyId) REFERENCES properties(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Settings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT,
        type TEXT DEFAULT 'string',
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  seedData() {
    // Check if data already exists
    const userCount = this.db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    if (userCount > 0) return;

    // Seed Users
    const insertUser = this.db.prepare(`
      INSERT INTO users (firstName, lastName, email, phone, role, status, joinDate, lastLogin, propertiesCount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const users = [
      ['John', 'Smith', 'john.smith@example.com', '+1234567890', 'agent', 'active', '2024-01-15', '2024-01-20', 15],
      ['Sarah', 'Johnson', 'sarah.johnson@example.com', '+1234567891', 'agent', 'active', '2024-01-10', '2024-01-19', 23],
      ['Mike', 'Wilson', 'mike.wilson@example.com', '+1234567892', 'buyer', 'active', '2024-01-12', '2024-01-18', 0],
      ['Lisa', 'Brown', 'lisa.brown@example.com', '+1234567893', 'seller', 'pending', '2024-01-14', '2024-01-17', 3],
      ['David', 'Lee', 'david.lee@example.com', '+1234567894', 'landlord', 'inactive', '2024-01-08', '2024-01-16', 8],
      ['Admin', 'User', 'admin@realestate.com', '+1234567895', 'admin', 'active', '2024-01-01', '2024-01-20', 0]
    ];

    users.forEach(user => insertUser.run(...user));

    // Seed Properties
    const insertProperty = this.db.prepare(`
      INSERT INTO properties (title, type, status, price, location, bedrooms, bathrooms, area, agentId, ownerId, views, inquiries, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const properties = [
      ['Luxury Villa in Beverly Hills', 'villa', 'active', 2500000, 'Beverly Hills, CA', 5, 4, 4500, 1, 4, 1234, 45, 'Stunning luxury villa with panoramic views'],
      ['Modern Apartment Downtown', 'apartment', 'active', 850000, 'Downtown, NY', 2, 2, 1200, 2, 4, 987, 32, 'Contemporary apartment in prime location'],
      ['Family House in Suburbs', 'house', 'pending', 650000, 'Suburbs, TX', 4, 3, 2800, 1, 4, 756, 28, 'Perfect family home with large garden'],
      ['Commercial Office Space', 'commercial', 'sold', 1200000, 'Business District, CA', 0, 4, 3500, 4, 5, 543, 15, 'Prime commercial space for business'],
      ['Cozy Studio Apartment', 'studio', 'rented', 2500, 'City Center, NY', 0, 1, 600, 5, 5, 432, 12, 'Compact studio in vibrant neighborhood']
    ];

    properties.forEach(property => insertProperty.run(...property));

    // Seed Transactions
    const insertTransaction = this.db.prepare(`
      INSERT INTO transactions (propertyId, propertyTitle, type, status, amount, buyerId, sellerId, agentId, commission, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transactions = [
      [1, 'Luxury Villa in Beverly Hills', 'sale', 'completed', 2500000, 3, 4, 1, 125000, '2024-01-20'],
      [2, 'Modern Apartment Downtown', 'rent', 'pending', 3500, 3, 4, 2, 350, '2024-01-19'],
      [3, 'Family House in Suburbs', 'sale', 'approved', 650000, 3, 4, 1, 32500, '2024-01-18']
    ];

    transactions.forEach(transaction => insertTransaction.run(...transaction));

    // Seed Inquiries
    const insertInquiry = this.db.prepare(`
      INSERT INTO inquiries (name, email, phone, propertyId, property, type, status, priority, message, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const inquiries = [
      ['John Smith', 'john@email.com', '+1-555-0123', 1, 'Luxury Villa Downtown', 'Sale', 'New', 'High', 'Interested in viewing this property. Available weekends.', '2024-01-15'],
      ['Sarah Johnson', 'sarah@email.com', '+1-555-0124', 2, 'Modern Apartment', 'Rent', 'Contacted', 'Medium', 'Looking for a 2-bedroom apartment for family.', '2024-01-14'],
      ['Mike Wilson', 'mike@email.com', '+1-555-0125', 3, 'Cozy House Suburbs', 'Sale', 'Responded', 'Low', 'Need more details about the neighborhood and schools.', '2024-01-13'],
      ['Emily Davis', 'emily@email.com', '+1-555-0126', 4, 'Penthouse Suite', 'Rent', 'Closed', 'High', 'Interested in long-term lease options.', '2024-01-12']
    ];

    inquiries.forEach(inquiry => insertInquiry.run(...inquiry));

    // Seed Payments
    const insertPayment = this.db.prepare(`
      INSERT INTO payments (transactionId, propertyId, userId, amount, type, status, method, reference, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const payments = [
      [1, 1, 3, 125000, 'commission', 'completed', 'bank_transfer', 'TXN001', '2024-01-20'],
      [2, 2, 3, 3500, 'rent', 'pending', 'credit_card', 'TXN002', '2024-01-19'],
      [3, 3, 3, 32500, 'commission', 'pending', 'bank_transfer', 'TXN003', '2024-01-18']
    ];

    payments.forEach(payment => insertPayment.run(...payment));
  }

  // Generic CRUD operations
  getAll(table, filters = {}) {
    let query = `SELECT * FROM ${table}`;
    const params = [];
    
    if (Object.keys(filters).length > 0) {
      const conditions = Object.keys(filters).map(key => {
        params.push(filters[key]);
        return `${key} = ?`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    return this.db.prepare(query).all(...params);
  }

  getById(table, id) {
    return this.db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  }

  create(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = this.db.prepare(query).run(...values);
    return { id: result.lastInsertRowid, ...data };
  }

  update(table, id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const query = `UPDATE ${table} SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    this.db.prepare(query).run(...values, id);
    return this.getById(table, id);
  }

  delete(table, id) {
    const result = this.db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    return result.changes > 0;
  }

  // Specific methods for complex queries
  getPropertiesWithAgent() {
    return this.db.prepare(`
      SELECT p.*, u.firstName || ' ' || u.lastName as agentName
      FROM properties p
      LEFT JOIN users u ON p.agentId = u.id
    `).all();
  }

  getTransactionsWithDetails() {
    return this.db.prepare(`
      SELECT t.*, 
             b.firstName || ' ' || b.lastName as buyerName,
             s.firstName || ' ' || s.lastName as sellerName,
             a.firstName || ' ' || a.lastName as agentName
      FROM transactions t
      LEFT JOIN users b ON t.buyerId = b.id
      LEFT JOIN users s ON t.sellerId = s.id
      LEFT JOIN users a ON t.agentId = a.id
    `).all();
  }

  getDashboardStats() {
    const totalProperties = this.db.prepare('SELECT COUNT(*) as count FROM properties').get().count;
    const activeProperties = this.db.prepare('SELECT COUNT(*) as count FROM properties WHERE status = "active"').get().count;
    const totalUsers = this.db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const pendingInquiries = this.db.prepare('SELECT COUNT(*) as count FROM inquiries WHERE status = "New"').get().count;
    const monthlyRevenue = this.db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = "completed" AND date >= date("now", "-30 days")').get().total;
    
    return {
      totalProperties,
      activeProperties,
      totalUsers,
      pendingInquiries,
      monthlyRevenue
    };
  }

  close() {
    this.db.close();
  }
}

module.exports = RealEstateDB;