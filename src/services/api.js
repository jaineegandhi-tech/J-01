// Import will be handled differently - RealtimeSync will be accessed globally

// Browser-compatible database service using localStorage as fallback
class LocalStorageDB {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Load all permanent data first if they exist
    this.loadPermanentData();
    
    // Only seed data if it doesn't exist to preserve changes
    const tables = ['users', 'properties', 'transactions', 'inquiries', 'payments', 'promotions', 'roles'];
    const needsSeeding = tables.some(table => !localStorage.getItem(`realestate_${table}`));
    
    if (needsSeeding) {
      this.seedData();
      this.savePermanentData();
    }
    
    // Initialize counter if not exists
    if (!localStorage.getItem('realestate_user_counter')) {
      localStorage.setItem('realestate_user_counter', '1000');
    }
  }

  loadPermanentData() {
    const tables = ['users', 'properties', 'transactions', 'inquiries', 'payments', 'promotions', 'roles'];
    tables.forEach(table => {
      const permanentData = localStorage.getItem(`realestate_${table}_permanent`);
      if (permanentData) {
        localStorage.setItem(`realestate_${table}`, permanentData);
      }
    });
    
    // Load permanent settings
    const settings = ['system_settings', 'security_settings', 'payment_settings', 'referral_settings'];
    settings.forEach(setting => {
      const permanentSetting = localStorage.getItem(`realestate_${setting}_permanent`);
      if (permanentSetting) {
        localStorage.setItem(`realestate_${setting}`, permanentSetting);
      }
    });
  }

  savePermanentData() {
    const tables = ['users', 'properties', 'transactions', 'inquiries', 'payments', 'promotions', 'roles'];
    tables.forEach(table => {
      const data = localStorage.getItem(`realestate_${table}`);
      if (data) {
        localStorage.setItem(`realestate_${table}_permanent`, data);
      }
    });
    
    // Save permanent settings
    const settings = ['system_settings', 'security_settings', 'payment_settings', 'referral_settings'];
    settings.forEach(setting => {
      const data = localStorage.getItem(`realestate_${setting}`);
      if (data) {
        localStorage.setItem(`realestate_${setting}_permanent`, data);
      }
    });
  }

  seedUsersOnly() {
    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('realestate_users') || '[]');
    
    const seedUsers = [
      // Agents (8 users)
      { id: 1, firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', phone: '+1234567890', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-15', lastLogin: '2024-01-20', propertiesCount: 15 },
      { id: 2, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@example.com', phone: '+1234567891', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-10', lastLogin: '2024-01-19', propertiesCount: 23 },
      { id: 3, firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@example.com', phone: '+1234567892', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-12', lastLogin: '2024-01-18', propertiesCount: 18 },
      { id: 4, firstName: 'Jennifer', lastName: 'Wilson', email: 'jennifer.wilson@example.com', phone: '+1234567893', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-14', lastLogin: '2024-01-17', propertiesCount: 12 },
      { id: 5, firstName: 'Christopher', lastName: 'Moore', email: 'christopher.moore@example.com', phone: '+1234567894', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-08', lastLogin: '2024-01-16', propertiesCount: 9 },
      { id: 6, firstName: 'Amanda', lastName: 'Taylor', email: 'amanda.taylor@example.com', phone: '+1234567895', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-16', lastLogin: '2024-01-19', propertiesCount: 14 },
      { id: 22, firstName: 'Jainee', lastName: 'Gandhi', email: 'jainee.gandhi@example.com', phone: '+1234567811', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-23', lastLogin: '2024-01-23', propertiesCount: 8 },
      { id: 23, firstName: 'Freya', lastName: 'Anderson', email: 'freya.anderson@example.com', phone: '+1234567812', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-23', lastLogin: '2024-01-23', propertiesCount: 11 },
      { id: 24, firstName: 'Siddhartth', lastName: 'Sharma', email: 'siddhartth.sharma@example.com', phone: '+1234567813', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-24', lastLogin: '2024-01-24', propertiesCount: 6 },
      
      // Clients (5 users)
      { id: 7, firstName: 'David', lastName: 'Lee', email: 'david.lee@example.com', phone: '+1234567896', role: 'client', roleId: 3, roleName: 'Client', status: 'active', joinDate: '2024-01-18', lastLogin: '2024-01-20', propertiesCount: 0 },
      { id: 8, firstName: 'Emma', lastName: 'Davis', email: 'emma.davis@example.com', phone: '+1234567897', role: 'client', roleId: 3, roleName: 'Client', status: 'active', joinDate: '2024-01-19', lastLogin: '2024-01-21', propertiesCount: 2 },
      { id: 9, firstName: 'Robert', lastName: 'Garcia', email: 'robert.garcia@example.com', phone: '+1234567898', role: 'client', roleId: 3, roleName: 'Client', status: 'active', joinDate: '2024-01-20', lastLogin: '2024-01-21', propertiesCount: 1 },
      { id: 10, firstName: 'Maria', lastName: 'Rodriguez', email: 'maria.rodriguez@example.com', phone: '+1234567899', role: 'client', roleId: 3, roleName: 'Client', status: 'active', joinDate: '2024-01-21', lastLogin: '2024-01-21', propertiesCount: 0 },
      { id: 11, firstName: 'James', lastName: 'Miller', email: 'james.miller@example.com', phone: '+1234567800', role: 'client', roleId: 3, roleName: 'Client', status: 'active', joinDate: '2024-01-22', lastLogin: '2024-01-22', propertiesCount: 3 },
      
      // Lenders (3 users)
      { id: 12, firstName: 'Lisa', lastName: 'Brown', email: 'lisa.brown@example.com', phone: '+1234567801', role: 'lender', roleId: 3, roleName: 'Lender', status: 'active', joinDate: '2024-01-15', lastLogin: '2024-01-20', propertiesCount: 8 },
      { id: 13, firstName: 'Daniel', lastName: 'Anderson', email: 'daniel.anderson@example.com', phone: '+1234567802', role: 'lender', roleId: 3, roleName: 'Lender', status: 'active', joinDate: '2024-01-17', lastLogin: '2024-01-19', propertiesCount: 5 },
      { id: 14, firstName: 'Jessica', lastName: 'Thomas', email: 'jessica.thomas@example.com', phone: '+1234567803', role: 'lender', roleId: 3, roleName: 'Lender', status: 'active', joinDate: '2024-01-19', lastLogin: '2024-01-21', propertiesCount: 6 },
      
      // Developers (3 users)
      { id: 15, firstName: 'Matthew', lastName: 'Jackson', email: 'matthew.jackson@example.com', phone: '+1234567804', role: 'developer', roleId: 3, roleName: 'Developer', status: 'active', joinDate: '2024-01-16', lastLogin: '2024-01-20', propertiesCount: 12 },
      { id: 16, firstName: 'Ashley', lastName: 'White', email: 'ashley.white@example.com', phone: '+1234567805', role: 'developer', roleId: 3, roleName: 'Developer', status: 'active', joinDate: '2024-01-18', lastLogin: '2024-01-21', propertiesCount: 9 },
      { id: 17, firstName: 'Joshua', lastName: 'Harris', email: 'joshua.harris@example.com', phone: '+1234567806', role: 'developer', roleId: 3, roleName: 'Developer', status: 'active', joinDate: '2024-01-20', lastLogin: '2024-01-22', propertiesCount: 7 },
      
      // Advertisers (2 users)
      { id: 18, firstName: 'Stephanie', lastName: 'Martin', email: 'stephanie.martin@example.com', phone: '+1234567807', role: 'advertiser', roleId: 3, roleName: 'Advertiser', status: 'active', joinDate: '2024-01-17', lastLogin: '2024-01-20', propertiesCount: 4 },
      { id: 19, firstName: 'Ryan', lastName: 'Clark', email: 'ryan.clark@example.com', phone: '+1234567808', role: 'advertiser', roleId: 3, roleName: 'Advertiser', status: 'active', joinDate: '2024-01-21', lastLogin: '2024-01-22', propertiesCount: 3 },
      
      // Affiliates (1 user)
      { id: 20, firstName: 'Anna', lastName: 'Lewis', email: 'anna.lewis@example.com', phone: '+1234567809', role: 'affiliate', roleId: 3, roleName: 'Affiliate', status: 'active', joinDate: '2024-01-19', lastLogin: '2024-01-21', propertiesCount: 2 },
      
      // Admin (1 user)
      { id: 25, firstName: 'Admin', lastName: 'User', email: 'admin@realestate.com', phone: '+1234567810', role: 'admin', roleId: 1, roleName: 'Super Admin', status: 'active', joinDate: '2024-01-01', lastLogin: '2024-01-22', propertiesCount: 0 }
    ];

    // Merge existing users with seed users, avoiding duplicates
    const allUsers = [...existingUsers];
    seedUsers.forEach(seedUser => {
      if (!allUsers.find(u => u.email === seedUser.email)) {
        allUsers.push(seedUser);
      }
    });

    localStorage.setItem('realestate_users', JSON.stringify(allUsers));
  }

  seedData() {
    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('realestate_users') || '[]');
    
    const seedUsers = [
      // Agents (8 users)
      { id: 1, firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', phone: '+1234567890', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-15', lastLogin: '2024-01-20', propertiesCount: 15 },
      { id: 2, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@example.com', phone: '+1234567891', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-10', lastLogin: '2024-01-19', propertiesCount: 23 },
      { id: 3, firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@example.com', phone: '+1234567892', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-12', lastLogin: '2024-01-18', propertiesCount: 18 },
      { id: 4, firstName: 'Jennifer', lastName: 'Wilson', email: 'jennifer.wilson@example.com', phone: '+1234567893', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-14', lastLogin: '2024-01-17', propertiesCount: 12 },
      { id: 5, firstName: 'Christopher', lastName: 'Moore', email: 'christopher.moore@example.com', phone: '+1234567894', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-08', lastLogin: '2024-01-16', propertiesCount: 9 },
      { id: 6, firstName: 'Amanda', lastName: 'Taylor', email: 'amanda.taylor@example.com', phone: '+1234567895', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-16', lastLogin: '2024-01-19', propertiesCount: 14 },
      { id: 22, firstName: 'Jainee', lastName: 'Gandhi', email: 'jainee.gandhi@example.com', phone: '+1234567811', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-23', lastLogin: '2024-01-23', propertiesCount: 8 },
      { id: 23, firstName: 'Freya', lastName: 'Anderson', email: 'freya.anderson@example.com', phone: '+1234567812', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-23', lastLogin: '2024-01-23', propertiesCount: 11 },
      { id: 24, firstName: 'Siddhartth', lastName: 'Sharma', email: 'siddhartth.sharma@example.com', phone: '+1234567813', role: 'agent', roleId: 2, roleName: 'Property Agent', status: 'active', joinDate: '2024-01-24', lastLogin: '2024-01-24', propertiesCount: 6 },
      
      // Clients (5 users)
      { id: 7, firstName: 'David', lastName: 'Lee', email: 'david.lee@example.com', phone: '+1234567896', role: 'client', roleId: 3, roleName: 'Client', status: 'active', joinDate: '2024-01-18', lastLogin: '2024-01-20', propertiesCount: 0 },
      { id: 8, firstName: 'Emma', lastName: 'Davis', email: 'emma.davis@example.com', phone: '+1234567897', role: 'client', roleId: 3, roleName: 'Client', status: 'active', joinDate: '2024-01-19', lastLogin: '2024-01-21', propertiesCount: 2 },
      { id: 9, firstName: 'Robert', lastName: 'Garcia', email: 'robert.garcia@example.com', phone: '+1234567898', role: 'client', roleId: 3, roleName: 'Client', status: 'active', joinDate: '2024-01-20', lastLogin: '2024-01-21', propertiesCount: 1 },
      { id: 10, firstName: 'Maria', lastName: 'Rodriguez', email: 'maria.rodriguez@example.com', phone: '+1234567899', role: 'client', roleId: 3, roleName: 'Client', status: 'active', joinDate: '2024-01-21', lastLogin: '2024-01-21', propertiesCount: 0 },
      { id: 11, firstName: 'James', lastName: 'Miller', email: 'james.miller@example.com', phone: '+1234567800', role: 'client', roleId: 3, roleName: 'Client', status: 'active', joinDate: '2024-01-22', lastLogin: '2024-01-22', propertiesCount: 3 },
      
      // Lenders (3 users)
      { id: 12, firstName: 'Lisa', lastName: 'Brown', email: 'lisa.brown@example.com', phone: '+1234567801', role: 'lender', roleId: 3, roleName: 'Lender', status: 'active', joinDate: '2024-01-15', lastLogin: '2024-01-20', propertiesCount: 8 },
      { id: 13, firstName: 'Daniel', lastName: 'Anderson', email: 'daniel.anderson@example.com', phone: '+1234567802', role: 'lender', roleId: 3, roleName: 'Lender', status: 'active', joinDate: '2024-01-17', lastLogin: '2024-01-19', propertiesCount: 5 },
      { id: 14, firstName: 'Jessica', lastName: 'Thomas', email: 'jessica.thomas@example.com', phone: '+1234567803', role: 'lender', roleId: 3, roleName: 'Lender', status: 'active', joinDate: '2024-01-19', lastLogin: '2024-01-21', propertiesCount: 6 },
      
      // Developers (3 users)
      { id: 15, firstName: 'Matthew', lastName: 'Jackson', email: 'matthew.jackson@example.com', phone: '+1234567804', role: 'developer', roleId: 3, roleName: 'Developer', status: 'active', joinDate: '2024-01-16', lastLogin: '2024-01-20', propertiesCount: 12 },
      { id: 16, firstName: 'Ashley', lastName: 'White', email: 'ashley.white@example.com', phone: '+1234567805', role: 'developer', roleId: 3, roleName: 'Developer', status: 'active', joinDate: '2024-01-18', lastLogin: '2024-01-21', propertiesCount: 9 },
      { id: 17, firstName: 'Joshua', lastName: 'Harris', email: 'joshua.harris@example.com', phone: '+1234567806', role: 'developer', roleId: 3, roleName: 'Developer', status: 'active', joinDate: '2024-01-20', lastLogin: '2024-01-22', propertiesCount: 7 },
      
      // Advertisers (2 users)
      { id: 18, firstName: 'Stephanie', lastName: 'Martin', email: 'stephanie.martin@example.com', phone: '+1234567807', role: 'advertiser', roleId: 3, roleName: 'Advertiser', status: 'active', joinDate: '2024-01-17', lastLogin: '2024-01-20', propertiesCount: 4 },
      { id: 19, firstName: 'Ryan', lastName: 'Clark', email: 'ryan.clark@example.com', phone: '+1234567808', role: 'advertiser', roleId: 3, roleName: 'Advertiser', status: 'active', joinDate: '2024-01-21', lastLogin: '2024-01-22', propertiesCount: 3 },
      
      // Affiliates (1 user)
      { id: 20, firstName: 'Anna', lastName: 'Lewis', email: 'anna.lewis@example.com', phone: '+1234567809', role: 'affiliate', roleId: 3, roleName: 'Affiliate', status: 'active', joinDate: '2024-01-19', lastLogin: '2024-01-21', propertiesCount: 2 },
      
      // Admin (1 user)
      { id: 25, firstName: 'Admin', lastName: 'User', email: 'admin@realestate.com', phone: '+1234567810', role: 'admin', roleId: 1, roleName: 'Super Admin', status: 'active', joinDate: '2024-01-01', lastLogin: '2024-01-22', propertiesCount: 0 }
    ];

    // Merge existing users with seed users, avoiding duplicates
    const allUsers = [...existingUsers];
    seedUsers.forEach(seedUser => {
      if (!allUsers.find(u => u.email === seedUser.email)) {
        allUsers.push(seedUser);
      }
    });

    const properties = [
      { id: 1, title: 'Luxury Villa in Beverly Hills', listingType: 'sale', category: 'villa', status: 'active', price: 2500000, location: 'Beverly Hills, CA', bedrooms: 5, bathrooms: 4, area: 4500, agentId: 1, ownerId: 4, views: 1234, inquiries: 45, description: 'Stunning luxury villa with panoramic views', agent: 'John Smith', createdAt: '2024-01-15', featured: true, images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300', 'https://images.unsplash.com/photo-1605276373954-0c4a0dac5cc0?w=300'] },
      { id: 2, title: 'Modern Apartment Downtown', listingType: 'rent', category: 'apartment', status: 'active', price: 850000, location: 'Downtown, NY', bedrooms: 2, bathrooms: 2, area: 1200, agentId: 2, ownerId: 4, views: 987, inquiries: 32, description: 'Contemporary apartment in prime location', agent: 'Sarah Johnson', createdAt: '2024-01-14', featured: false, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300'] },
      { id: 3, title: 'Family House in Suburbs', type: 'house', status: 'active', price: 650000, location: 'Suburbs, TX', bedrooms: 4, bathrooms: 3, area: 2800, agentId: 1, ownerId: 4, views: 756, inquiries: 28, description: 'Perfect family home with large garden', agent: 'Mike Wilson', createdAt: '2024-01-13', featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=300', 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=300', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=300'] },
      { id: 4, title: 'Commercial Office Space', type: 'commercial', status: 'sold', price: 1200000, location: 'Business District, CA', bedrooms: 0, bathrooms: 4, area: 3500, agentId: 4, ownerId: 5, views: 543, inquiries: 15, description: 'Prime commercial space for business', agent: 'Lisa Brown', createdAt: '2024-01-12', featured: false, category: 'Commercial', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=300'] },
      { id: 5, title: 'Cozy Studio Apartment', type: 'studio', status: 'rented', price: 2500, location: 'City Center, NY', bedrooms: 0, bathrooms: 1, area: 600, agentId: 5, ownerId: 5, views: 432, inquiries: 12, description: 'Compact studio in vibrant neighborhood', agent: 'David Lee', createdAt: '2024-01-11', featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300'] },
      { id: 6, title: 'Cozy Family Home', type: 'house', status: 'active', price: 450000, location: 'Austin, TX', bedrooms: 3, bathrooms: 2, area: 1800, agentId: 2, ownerId: 4, views: 0, inquiries: 0, description: 'Perfect family home with spacious backyard', agent: 'Sarah Wilson', createdAt: new Date().toISOString().split('T')[0], featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300', 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=300'] },
      { id: 7, title: 'Modern Loft Downtown', type: 'apartment', status: 'active', price: 750000, location: 'Seattle, WA', bedrooms: 2, bathrooms: 2, area: 1400, agentId: 1, ownerId: 4, views: 0, inquiries: 0, description: 'Stylish loft with city views', agent: 'John Smith', createdAt: new Date().toISOString().split('T')[0], featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300'] },
      { id: 8, title: 'Beachfront Condo', type: 'condo', status: 'active', price: 950000, location: 'Miami Beach, FL', bedrooms: 3, bathrooms: 2, area: 1600, agentId: 2, ownerId: 4, views: 0, inquiries: 0, description: 'Luxury condo with ocean views', agent: 'Sarah Johnson', createdAt: new Date().toISOString().split('T')[0], featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300'] },
      { id: 9, title: 'Mountain Cabin Retreat', type: 'house', status: 'active', price: 380000, location: 'Aspen, CO', bedrooms: 2, bathrooms: 1, area: 1200, agentId: 1, ownerId: 4, views: 0, inquiries: 0, description: 'Cozy cabin in the mountains', agent: 'John Smith', createdAt: new Date().toISOString().split('T')[0], featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300'] },
      { id: 10, title: 'Urban Townhouse', type: 'townhouse', status: 'active', price: 620000, location: 'Portland, OR', bedrooms: 3, bathrooms: 3, area: 2000, agentId: 2, ownerId: 4, views: 0, inquiries: 0, description: 'Modern townhouse in trendy neighborhood', agent: 'Sarah Johnson', createdAt: new Date().toISOString().split('T')[0], featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=300', 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=300'] },
      
      // 10 New Properties with Full Details
      { id: 11, title: 'Luxury Penthouse Manhattan', type: 'apartment', status: 'active', price: 3200000, location: 'Manhattan, NY', bedrooms: 4, bathrooms: 3, area: 2800, agentId: 1, ownerId: 4, views: 2156, inquiries: 67, description: 'Exclusive penthouse with stunning city skyline views, premium finishes, and private terrace', agent: 'John Smith', createdAt: '2024-01-23', featured: true, category: 'Residential', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300'] },
      { id: 12, title: 'Waterfront Villa Malibu', type: 'villa', status: 'active', price: 4500000, location: 'Malibu, CA', bedrooms: 6, bathrooms: 5, area: 5200, agentId: 2, ownerId: 4, views: 1876, inquiries: 89, description: 'Spectacular oceanfront villa with private beach access, infinity pool, and panoramic ocean views', agent: 'Sarah Johnson', createdAt: '2024-01-22', featured: true, category: 'Residential', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=300', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300'] },
      { id: 13, title: 'Historic Brownstone Boston', type: 'house', status: 'active', price: 1850000, location: 'Back Bay, Boston, MA', bedrooms: 5, bathrooms: 4, area: 3400, agentId: 3, ownerId: 4, views: 1234, inquiries: 45, description: 'Beautifully restored Victorian brownstone with original architectural details, modern amenities, and private garden', agent: 'Michael Brown', createdAt: '2024-01-21', featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300'] },
      { id: 14, title: 'Modern Condo Chicago', type: 'condo', status: 'active', price: 725000, location: 'River North, Chicago, IL', bedrooms: 2, bathrooms: 2, area: 1350, agentId: 4, ownerId: 4, views: 987, inquiries: 34, description: 'Contemporary high-rise condo with floor-to-ceiling windows, premium appliances, and building amenities', agent: 'Jennifer Wilson', createdAt: '2024-01-20', featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300'] },
      { id: 15, title: 'Ranch Style Home Phoenix', type: 'house', status: 'active', price: 580000, location: 'Scottsdale, Phoenix, AZ', bedrooms: 4, bathrooms: 3, area: 2600, agentId: 5, ownerId: 4, views: 756, inquiries: 28, description: 'Spacious ranch home with desert landscaping, pool, and mountain views in prestigious neighborhood', agent: 'Christopher Moore', createdAt: '2024-01-19', featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300'] },
      { id: 16, title: 'Luxury Townhouse San Francisco', type: 'townhouse', status: 'active', price: 2100000, location: 'Pacific Heights, San Francisco, CA', bedrooms: 3, bathrooms: 3, area: 2200, agentId: 6, ownerId: 4, views: 1456, inquiries: 56, description: 'Elegant Victorian townhouse with bay views, updated kitchen, and private rooftop deck', agent: 'Amanda Taylor', createdAt: '2024-01-18', featured: true, category: 'Residential', images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=300', 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=300'] },
      { id: 17, title: 'Lakefront Cabin Minnesota', type: 'house', status: 'active', price: 420000, location: 'Lake Minnetonka, MN', bedrooms: 3, bathrooms: 2, area: 1650, agentId: 1, ownerId: 4, views: 543, inquiries: 23, description: 'Charming lakefront cabin with private dock, fireplace, and serene water views perfect for weekend getaways', agent: 'John Smith', createdAt: '2024-01-17', featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300'] },
      { id: 18, title: 'Downtown Loft Atlanta', type: 'apartment', status: 'active', price: 485000, location: 'Midtown, Atlanta, GA', bedrooms: 1, bathrooms: 1, area: 950, agentId: 2, ownerId: 4, views: 432, inquiries: 19, description: 'Industrial-style loft with exposed brick, high ceilings, and modern fixtures in vibrant arts district', agent: 'Sarah Johnson', createdAt: '2024-01-16', featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300'] },
      { id: 19, title: 'Suburban Family Home Denver', type: 'house', status: 'active', price: 675000, location: 'Cherry Creek, Denver, CO', bedrooms: 4, bathrooms: 3, area: 2400, agentId: 3, ownerId: 4, views: 876, inquiries: 31, description: 'Beautiful two-story home with open floor plan, finished basement, and large backyard in family-friendly neighborhood', agent: 'Michael Brown', createdAt: '2024-01-15', featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300', 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=300'] },
      { id: 20, title: 'Beachside Condo Miami', type: 'condo', status: 'active', price: 1250000, location: 'South Beach, Miami, FL', bedrooms: 2, bathrooms: 2, area: 1400, agentId: 4, ownerId: 4, views: 1654, inquiries: 72, description: 'Stunning beachfront condo with direct ocean access, resort-style amenities, and Art Deco architecture', agent: 'Jennifer Wilson', createdAt: '2024-01-14', featured: true, category: 'Residential', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300'] },
      
      // Jainee Gandhi's Properties
      { id: 21, title: 'Modern Penthouse Downtown', type: 'apartment', status: 'active', price: 1850000, location: 'Downtown, Los Angeles, CA', bedrooms: 3, bathrooms: 3, area: 2200, agentId: 22, ownerId: 4, views: 892, inquiries: 34, description: 'Luxurious penthouse with panoramic city views, premium finishes, and rooftop terrace', agent: 'Jainee Gandhi', createdAt: '2024-01-23', featured: true, category: 'Residential', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300'] },
      { id: 22, title: 'Elegant Townhouse', type: 'townhouse', status: 'active', price: 975000, location: 'Beverly Hills, CA', bedrooms: 4, bathrooms: 3, area: 2800, agentId: 22, ownerId: 4, views: 567, inquiries: 28, description: 'Sophisticated townhouse in prestigious neighborhood with private garden and garage', agent: 'Jainee Gandhi', createdAt: '2024-01-23', featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=300', 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=300'] },
      
      // Freya Anderson's Properties
      { id: 23, title: 'Luxury Waterfront Villa', type: 'villa', status: 'active', price: 3200000, location: 'Malibu, CA', bedrooms: 5, bathrooms: 4, area: 4200, agentId: 23, ownerId: 4, views: 1234, inquiries: 56, description: 'Spectacular oceanfront villa with private beach access, infinity pool, and stunning sunset views', agent: 'Freya Anderson', createdAt: '2024-01-23', featured: true, category: 'Residential', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=300'] },
      { id: 24, title: 'Contemporary Loft', type: 'apartment', status: 'active', price: 825000, location: 'SoHo, New York, NY', bedrooms: 2, bathrooms: 2, area: 1600, agentId: 23, ownerId: 4, views: 743, inquiries: 31, description: 'Stylish industrial loft with exposed brick, high ceilings, and modern amenities in trendy neighborhood', agent: 'Freya Anderson', createdAt: '2024-01-23', featured: false, category: 'Residential', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300'] },
      
      // Siddhartth Sharma's Properties
      { id: 25, title: 'Executive Office Suite', type: 'commercial', status: 'active', price: 1650000, location: 'Financial District, San Francisco, CA', bedrooms: 0, bathrooms: 2, area: 2500, agentId: 24, ownerId: 4, views: 456, inquiries: 18, description: 'Premium commercial space with panoramic bay views, modern amenities, and prime business location', agent: 'Siddhartth Sharma', createdAt: '2024-01-24', featured: false, category: 'Commercial', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=300', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300'] },
      { id: 26, title: 'Luxury High-Rise Apartment', type: 'apartment', status: 'active', price: 1250000, location: 'Midtown, Manhattan, NY', bedrooms: 3, bathrooms: 2, area: 1800, agentId: 24, ownerId: 4, views: 678, inquiries: 29, description: 'Sophisticated apartment with city views, premium finishes, and world-class building amenities', agent: 'Siddhartth Sharma', createdAt: '2024-01-24', featured: true, category: 'Residential', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300'] },
      
      // Somnath Property - Pending Approval
      { id: 27, title: 'Somnath Villa', listingType: 'sale', category: 'villa', status: 'pending_approval', price: 1850000, location: 'Somnath, Gujarat, India', bedrooms: 4, bathrooms: 3, area: 3200, agentId: 1, ownerId: 4, views: 0, inquiries: 0, description: 'Beautiful villa near the famous Somnath Temple with traditional architecture and modern amenities', agent: 'John Smith', createdAt: '2024-01-25', featured: false, images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300'], approvalStatus: 'pending', submittedBy: 1, submittedAt: '2024-01-25' },
      
      // Test New Property - Pending Approval
      { id: 28, title: 'New Test Apartment', listingType: 'rent', category: 'apartment', status: 'pending_approval', price: 750000, location: 'Test City, CA', bedrooms: 2, bathrooms: 2, area: 1200, agentId: 1, ownerId: 4, views: 0, inquiries: 0, description: 'Test property for approval workflow', agent: 'John Smith', createdAt: '2024-01-26', featured: false, images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300'], approvalStatus: 'pending', submittedBy: 1, submittedAt: '2024-01-26' }
    ];

    const transactions = [
      { id: 1, propertyId: 1, propertyTitle: 'Luxury Villa in Beverly Hills', type: 'sale', status: 'completed', amount: 2500000, buyer: 'John Doe', seller: 'Jane Smith', agent: 'Mike Wilson', buyerId: 3, sellerId: 4, agentId: 1, commission: 125000, date: '2024-01-20' },
      { id: 2, propertyId: 2, propertyTitle: 'Modern Apartment Downtown', type: 'rent', status: 'pending', amount: 3500, buyer: 'Sarah Johnson', seller: 'David Lee', agent: 'Lisa Brown', buyerId: 3, sellerId: 4, agentId: 2, commission: 350, date: '2024-01-19' },
      { id: 3, propertyId: 3, propertyTitle: 'Family House in Suburbs', type: 'sale', status: 'approved', amount: 650000, buyer: 'Robert Wilson', seller: 'Mary Davis', agent: 'John Smith', buyerId: 3, sellerId: 4, agentId: 1, commission: 32500, date: '2024-01-18' }
    ];

    const inquiries = [
      { id: 1, name: 'John Smith', email: 'john@email.com', phone: '+1-555-0123', property: 'Luxury Villa Downtown', propertyId: 1, type: 'Sale', status: 'New', date: '2024-01-15', message: 'Interested in viewing this property. Available weekends.', priority: 'High' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1-555-0124', property: 'Modern Apartment', propertyId: 2, type: 'Rent', status: 'Contacted', date: '2024-01-14', message: 'Looking for a 2-bedroom apartment for family.', priority: 'Medium' },
      { id: 3, name: 'Mike Wilson', email: 'mike@email.com', phone: '+1-555-0125', property: 'Cozy House Suburbs', propertyId: 3, type: 'Sale', status: 'Responded', date: '2024-01-13', message: 'Need more details about the neighborhood and schools.', priority: 'Low' },
      { id: 4, name: 'Emily Davis', email: 'emily@email.com', phone: '+1-555-0126', property: 'Penthouse Suite', propertyId: 4, type: 'Rent', status: 'Closed', date: '2024-01-12', message: 'Interested in long-term lease options.', priority: 'High' }
    ];

    const payments = [
      { id: 1, transactionId: 1, propertyId: 1, userId: 3, amount: 125000, type: 'commission', status: 'completed', method: 'bank_transfer', reference: 'TXN001', date: '2024-01-20', description: 'Commission payment for villa sale' },
      { id: 2, transactionId: 2, propertyId: 2, userId: 3, amount: 3500, type: 'rent', status: 'pending', method: 'credit_card', reference: 'TXN002', date: '2024-01-19', description: 'Monthly rent payment' },
      { id: 3, transactionId: 3, propertyId: 3, userId: 3, amount: 32500, type: 'commission', status: 'pending', method: 'bank_transfer', reference: 'TXN003', date: '2024-01-18', description: 'Commission for house sale' },
      { id: 4, transactionId: null, propertyId: 4, userId: 4, amount: 5000, type: 'deposit', status: 'completed', method: 'check', reference: 'TXN004', date: '2024-01-17', description: 'Security deposit' }
    ];

    const promotions = [
      { id: 1, title: 'New Year Special', description: '20% off on all premium listings', type: 'percentage', value: 20, status: 'active', startDate: '2024-01-01', endDate: '2024-01-31', code: 'NY2024', usageCount: 45, maxUsage: 100 },
      { id: 2, title: 'Agent Bonus', description: '$500 bonus for new agent registrations', type: 'fixed', value: 500, status: 'active', startDate: '2024-01-15', endDate: '2024-02-15', code: 'AGENT500', usageCount: 12, maxUsage: 50 },
      { id: 3, title: 'Premium Upgrade', description: 'Free premium upgrade for 3 months', type: 'service', value: 0, status: 'scheduled', startDate: '2024-02-01', endDate: '2024-04-30', code: 'PREMIUM3M', usageCount: 0, maxUsage: 200 },
      { id: 4, title: 'First Property Free', description: 'No listing fee for first property', type: 'percentage', value: 100, status: 'expired', startDate: '2023-12-01', endDate: '2023-12-31', code: 'FIRST2023', usageCount: 89, maxUsage: 100 }
    ];

    const roles = [
      {
        id: 1,
        name: 'Super Admin',
        description: 'Full system access with all permissions',
        type: 'internal',
        status: 'active',
        userCount: 1,
        permissions: {
          dashboard: { view: true },
          users: { view: true, edit: true, delete: true },
          properties: { view: true, approve: true, reject: true, edit: true, delete: true },
          transactions: { view: true, manage: true, export: true },
          promotions: { create: true, edit: true, deactivate: true, delete: true },
          reports: { view: true, export: true },
          settings: { full: true, limited: false, none: false }
        }
      },
      {
        id: 2,
        name: 'Property Agent',
        description: 'Manage properties and client interactions',
        type: 'external',
        status: 'active',
        userCount: 2,
        permissions: {
          dashboard: { view: true },
          users: { view: true, edit: false, delete: false },
          properties: { view: true, approve: false, reject: false, edit: true, delete: false },
          transactions: { view: true, manage: false, export: false },
          promotions: { create: false, edit: false, deactivate: false, delete: false },
          reports: { view: true, export: false },
          settings: { full: false, limited: false, none: true }
        }
      },
      {
        id: 3,
        name: 'Client',
        description: 'Basic access for buyers and sellers',
        type: 'external',
        status: 'active',
        userCount: 3,
        permissions: {
          dashboard: { view: true },
          users: { view: false, edit: false, delete: false },
          properties: { view: true, approve: false, reject: false, edit: false, delete: false },
          transactions: { view: true, manage: false, export: false },
          promotions: { create: false, edit: false, deactivate: false, delete: false },
          reports: { view: false, export: false },
          settings: { full: false, limited: false, none: true }
        }
      }
    ];

    localStorage.setItem('realestate_users', JSON.stringify(allUsers));
    localStorage.setItem('realestate_properties', JSON.stringify(properties));
    localStorage.setItem('realestate_transactions', JSON.stringify(transactions));
    localStorage.setItem('realestate_inquiries', JSON.stringify(inquiries));
    localStorage.setItem('realestate_payments', JSON.stringify(payments));
    localStorage.setItem('realestate_promotions', JSON.stringify(promotions));
    localStorage.setItem('realestate_roles', JSON.stringify(roles));
    
    console.log('All data seeded successfully');
  }

  // Sync method to User App
  syncToUserApp(table, data) {
    try {
      fetch('http://localhost:3005/sync-admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, data, timestamp: Date.now() })
      }).catch(() => {});
      
      // Also sync users table when properties change (for agent updates)
      if (table === 'properties') {
        const users = this.getAll('users');
        fetch('http://localhost:3005/sync-admin-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table: 'users', data: users, timestamp: Date.now() })
        }).catch(() => {});
      }
    } catch (error) {}
  }

  // Generic CRUD operations
  getAll(table) {
    const data = localStorage.getItem(`realestate_${table}`);
    return data ? JSON.parse(data) : [];
  }

  getById(table, id) {
    const items = this.getAll(table);
    return items.find(item => item.id === parseInt(id));
  }

  create(table, data) {
    const items = this.getAll(table);
    const newId = Math.max(...items.map(item => item.id), 0) + 1;
    const newItem = { 
      ...data, 
      id: newId, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    localStorage.setItem(`realestate_${table}`, JSON.stringify(items));
    localStorage.setItem(`realestate_${table}_permanent`, JSON.stringify(items));
    
    // Broadcast changes for real-time sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: `realestate_${table}`,
      newValue: JSON.stringify(items)
    }));
    
    // Sync to User App
    this.syncToUserApp(table, items);
    
    return newItem;
  }

  update(table, id, data) {
    const items = this.getAll(table);
    const index = items.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      items[index] = { 
        ...items[index], 
        ...data, 
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`realestate_${table}`, JSON.stringify(items));
      localStorage.setItem(`realestate_${table}_permanent`, JSON.stringify(items));
      
      // Broadcast changes for real-time sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: `realestate_${table}`,
        newValue: JSON.stringify(items)
      }));
      
      // Sync to User App
      this.syncToUserApp(table, items);
      
      return items[index];
    }
    return null;
  }

  delete(table, id) {
    const items = this.getAll(table);
    const filteredItems = items.filter(item => item.id !== parseInt(id));
    localStorage.setItem(`realestate_${table}`, JSON.stringify(filteredItems));
    localStorage.setItem(`realestate_${table}_permanent`, JSON.stringify(filteredItems));
    
    // Broadcast changes for real-time sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: `realestate_${table}`,
      newValue: JSON.stringify(filteredItems)
    }));
    
    // Sync to User App
    this.syncToUserApp(table, filteredItems);
    
    return filteredItems.length < items.length;
  }

  // Specific methods
  getPropertiesWithAgent() {
    const properties = this.getAll('properties');
    const users = this.getAll('users');
    
    return properties.map(property => {
      const agent = users.find(user => user.id === property.agentId);
      return {
        ...property,
        agentName: agent ? `${agent.firstName} ${agent.lastName}` : 'Unassigned'
      };
    });
  }

  getTransactionsWithDetails() {
    const transactions = this.getAll('transactions');
    const users = this.getAll('users');
    
    return transactions.map(transaction => {
      const buyer = users.find(user => user.id === transaction.buyerId);
      const seller = users.find(user => user.id === transaction.sellerId);
      const agent = users.find(user => user.id === transaction.agentId);
      
      return {
        ...transaction,
        buyerName: buyer ? `${buyer.firstName} ${buyer.lastName}` : transaction.buyer,
        sellerName: seller ? `${seller.firstName} ${seller.lastName}` : transaction.seller,
        agentName: agent ? `${agent.firstName} ${agent.lastName}` : transaction.agent
      };
    });
  }

  getDashboardStats() {
    const properties = this.getAll('properties');
    const users = this.getAll('users');
    const inquiries = this.getAll('inquiries');
    const payments = this.getAll('payments');
    
    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.status === 'active').length;
    const totalUsers = users.length;
    const pendingInquiries = inquiries.filter(i => i.status === 'New').length;
    const monthlyRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalProperties,
      activeProperties,
      totalUsers,
      pendingInquiries,
      monthlyRevenue
    };
  }
}

// API service that uses localStorage
class APIService {
  constructor() {
    this.db = new LocalStorageDB();
  }

  // Users API
  async getUsers() {
    // Check for cross-port sync data
    this.syncUsersFromCrossPort();
    return Promise.resolve(this.db.getAll('users'));
  }

  syncUsersFromCrossPort() {
    try {
      // Check for sync data from User App (port 3003)
      const lastCheck = parseInt(localStorage.getItem('admin_last_sync_check') || '0');
      const syncCounter = parseInt(localStorage.getItem('sync_counter') || '0');
      
      if (syncCounter > lastCheck) {
        const latestSync = localStorage.getItem('latest_user_sync');
        if (latestSync) {
          const syncData = JSON.parse(latestSync);
          if (syncData.action === 'user_registered' && syncData.user) {
            // Get current users and ensure seed data is preserved
            let adminUsers = this.db.getAll('users');
            if (adminUsers.length === 0) {
              // Re-initialize if data was lost
              this.db.seedData();
              adminUsers = this.db.getAll('users');
            }
            
            const userExists = adminUsers.find(u => u.email === syncData.user.email);
            if (!userExists) {
              console.log('Syncing new user from User App:', syncData.user.email);
              adminUsers.push(syncData.user);
              localStorage.setItem('realestate_users', JSON.stringify(adminUsers));
            }
          }
        }
        localStorage.setItem('admin_last_sync_check', syncCounter.toString());
      }
    } catch (error) {
      console.log('Cross-port sync check failed:', error);
    }
  }



  async getUserById(id) {
    return Promise.resolve(this.db.getById('users', id));
  }

  async createUser(userData) {
    // Get role permissions if roleId is provided
    if (userData.roleId) {
      const role = this.db.getById('roles', userData.roleId);
      if (role) {
        userData.permissions = role.permissions;
        userData.roleName = role.name;
      }
    }
    return Promise.resolve(this.db.create('users', userData));
  }

  async updateUser(id, userData) {
    // Update role permissions if roleId is being changed
    if (userData.roleId) {
      const role = this.db.getById('roles', userData.roleId);
      if (role) {
        userData.permissions = role.permissions;
        userData.roleName = role.name;
      }
    }
    
    // Check for email uniqueness if email is being updated
    if (userData.email) {
      const users = this.db.getAll('users');
      const currentUserId = parseInt(id);
      
      // Skip email uniqueness check for admin user or if it's the same user
      const existingUser = users.find(user => 
        user.email === userData.email && 
        user.id !== currentUserId &&
        userData.email !== 'admin@realestate.com'
      );
      
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }
    
    return Promise.resolve(this.db.update('users', id, userData));
  }

  async deleteUser(id) {
    return Promise.resolve(this.db.delete('users', id));
  }

  // Properties API
  async getProperties() {
    return Promise.resolve(this.db.getPropertiesWithAgent());
  }

  async getPublicProperties() {
    // Only return approved/active properties for public view
    const properties = this.db.getPropertiesWithAgent();
    return Promise.resolve(properties.filter(p => p.status === 'active'));
  }

  async getPropertyById(id) {
    return Promise.resolve(this.db.getById('properties', id));
  }

  async createProperty(propertyData) {
    return Promise.resolve(this.db.create('properties', propertyData));
  }

  async updateProperty(id, propertyData) {
    return Promise.resolve(this.db.update('properties', id, propertyData));
  }

  async deleteProperty(id) {
    return Promise.resolve(this.db.delete('properties', id));
  }

  async approveProperty(id) {
    const property = this.db.getById('properties', id);
    if (property && property.status === 'pending_approval') {
      return Promise.resolve(this.db.update('properties', id, {
        status: 'active',
        approvalStatus: 'approved',
        approvedBy: 25, // Admin user ID
        approvedAt: new Date().toISOString()
      }));
    }
    throw new Error('Property not found or not pending approval');
  }

  async rejectProperty(id, reason = '') {
    const property = this.db.getById('properties', id);
    if (property && property.status === 'pending_approval') {
      return Promise.resolve(this.db.update('properties', id, {
        status: 'rejected',
        approvalStatus: 'rejected',
        rejectedBy: 25, // Admin user ID
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason
      }));
    }
    throw new Error('Property not found or not pending approval');
  }

  async getPendingProperties() {
    const properties = this.db.getPropertiesWithAgent();
    return Promise.resolve(properties.filter(p => p.status === 'pending_approval'));
  }

  async getApprovedProperties() {
    const properties = this.db.getPropertiesWithAgent();
    return Promise.resolve(properties.filter(p => p.status === 'active'));
  }

  // Transactions API
  async getTransactions() {
    return Promise.resolve(this.db.getTransactionsWithDetails());
  }

  async getTransactionById(id) {
    return Promise.resolve(this.db.getById('transactions', id));
  }

  async createTransaction(transactionData) {
    return Promise.resolve(this.db.create('transactions', transactionData));
  }

  async updateTransaction(id, transactionData) {
    return Promise.resolve(this.db.update('transactions', id, transactionData));
  }

  async deleteTransaction(id) {
    return Promise.resolve(this.db.delete('transactions', id));
  }

  // Inquiries API
  async getInquiries() {
    return Promise.resolve(this.db.getAll('inquiries'));
  }

  async getInquiryById(id) {
    return Promise.resolve(this.db.getById('inquiries', id));
  }

  async createInquiry(inquiryData) {
    return Promise.resolve(this.db.create('inquiries', inquiryData));
  }

  async updateInquiry(id, inquiryData) {
    return Promise.resolve(this.db.update('inquiries', id, inquiryData));
  }

  async deleteInquiry(id) {
    return Promise.resolve(this.db.delete('inquiries', id));
  }

  // Payments API
  async getPayments() {
    return Promise.resolve(this.db.getAll('payments'));
  }

  async getPaymentById(id) {
    return Promise.resolve(this.db.getById('payments', id));
  }

  async createPayment(paymentData) {
    return Promise.resolve(this.db.create('payments', paymentData));
  }

  async updatePayment(id, paymentData) {
    return Promise.resolve(this.db.update('payments', id, paymentData));
  }

  async deletePayment(id) {
    return Promise.resolve(this.db.delete('payments', id));
  }

  // Promotions API
  async getPromotions() {
    return Promise.resolve(this.db.getAll('promotions'));
  }

  async getPromotionById(id) {
    return Promise.resolve(this.db.getById('promotions', id));
  }

  async createPromotion(promotionData) {
    return Promise.resolve(this.db.create('promotions', promotionData));
  }

  async updatePromotion(id, promotionData) {
    return Promise.resolve(this.db.update('promotions', id, promotionData));
  }

  async deletePromotion(id) {
    return Promise.resolve(this.db.delete('promotions', id));
  }

  // Roles API
  async getRoles() {
    return Promise.resolve(this.db.getAll('roles'));
  }

  async getRoleById(id) {
    return Promise.resolve(this.db.getById('roles', id));
  }

  async createRole(roleData) {
    return Promise.resolve(this.db.create('roles', roleData));
  }

  async updateRole(id, roleData) {
    return Promise.resolve(this.db.update('roles', id, roleData));
  }

  async deleteRole(id) {
    return Promise.resolve(this.db.delete('roles', id));
  }

  // Dashboard API
  async getDashboardStats() {
    return Promise.resolve(this.db.getDashboardStats());
  }

  // System Settings API
  async getSystemSettings() {
    const settings = localStorage.getItem('realestate_system_settings');
    return Promise.resolve(settings ? JSON.parse(settings) : null);
  }

  async saveSystemSettings(settingsData) {
    localStorage.setItem('realestate_system_settings', JSON.stringify(settingsData));
    localStorage.setItem('realestate_system_settings_permanent', JSON.stringify(settingsData));
    return Promise.resolve(settingsData);
  }

  async getSecuritySettings() {
    const settings = localStorage.getItem('realestate_security_settings');
    return Promise.resolve(settings ? JSON.parse(settings) : null);
  }

  async saveSecuritySettings(settingsData) {
    localStorage.setItem('realestate_security_settings', JSON.stringify(settingsData));
    localStorage.setItem('realestate_security_settings_permanent', JSON.stringify(settingsData));
    return Promise.resolve(settingsData);
  }

  async getPaymentSettings() {
    const settings = localStorage.getItem('realestate_payment_settings');
    return Promise.resolve(settings ? JSON.parse(settings) : null);
  }

  async savePaymentSettings(settingsData) {
    localStorage.setItem('realestate_payment_settings', JSON.stringify(settingsData));
    localStorage.setItem('realestate_payment_settings_permanent', JSON.stringify(settingsData));
    return Promise.resolve(settingsData);
  }

  async testPaymentConnection(settingsData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock test result - in real implementation, this would call the payment gateway API
    if (settingsData.apiKey && settingsData.merchantId && settingsData.secretKey) {
      return Promise.resolve({ success: true, message: 'Connection successful' });
    } else {
      return Promise.resolve({ success: false, message: 'Invalid credentials' });
    }
  }

  // Profile Management API
  async changePassword(passwordData, userId) {
    // Simulate password validation
    const users = this.db.getAll('users');
    const currentUser = users.find(user => user.id === parseInt(userId));
    
    if (!currentUser) {
      throw new Error('User not found');
    }
    
    // In real implementation, you would verify the current password
    // For demo purposes, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user with new password (in real app, hash the password)
    const updatedUser = this.db.update('users', currentUser.id, {
      password: passwordData.newPassword, // In real app, this should be hashed
      passwordUpdatedAt: new Date().toISOString()
    });
    
    return Promise.resolve({ success: true, message: 'Password updated successfully' });
  }

  // Referral System APIs
  async getAffiliateApplications() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve([
      {
        id: 1,
        applicationId: 'APP001',
        fullName: 'John Smith',
        email: 'john@example.com',
        phone: '+1234567890',
        userType: 'agent',
        country: 'USA',
        city: 'New York',
        payoutMethod: 'ABA Bank Transfer',
        appliedOn: '2024-01-15T10:30:00Z',
        referralType: 'Standard',
        status: 'pending'
      },
      {
        id: 2,
        applicationId: 'APP002',
        fullName: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1234567891',
        userType: 'developer',
        country: 'Canada',
        city: 'Toronto',
        payoutMethod: 'PayPal',
        appliedOn: '2024-01-14T14:20:00Z',
        referralType: 'Chain Referral',
        status: 'approved',
        referralCode: 'REF12345'
      }
    ]);
  }

  async getAffiliateApplication(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve({
      id: parseInt(id),
      applicationId: 'APP001',
      fullName: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890',
      userType: 'agent',
      country: 'USA',
      city: 'New York',
      payoutMethod: 'ABA Bank Transfer',
      appliedOn: '2024-01-15T10:30:00Z',
      referralType: 'Standard',
      status: 'pending'
    });
  }

  async approveAffiliateApplication(id) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Promise.resolve({ success: true, referralCode: 'REF' + Math.random().toString(36).substr(2, 5).toUpperCase() });
  }

  async rejectAffiliateApplication(id, data) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Promise.resolve({ success: true });
  }

  async getActiveAffiliates() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve([
      {
        id: 1,
        fullName: 'Sarah Johnson',
        email: 'sarah@example.com',
        referralCode: 'REF12345',
        totalReferrals: 15,
        totalEarnings: 2500,
        joinDate: '2024-01-10'
      },
      {
        id: 2,
        fullName: 'Mike Wilson',
        email: 'mike@example.com',
        referralCode: 'REF67890',
        totalReferrals: 8,
        totalEarnings: 1200,
        joinDate: '2024-01-05'
      }
    ]);
  }

  async getReferralSettings() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const settings = localStorage.getItem('realestate_referral_settings');
    return Promise.resolve(settings ? JSON.parse(settings) : {
      programEnabled: true,
      referralMode: 'standard',
      standardCommission: 10,
      level1Commission: 8,
      level2Commission: 3,
      minimumPayout: 50,
      payoutFrequency: 'monthly'
    });
  }

  async updateReferralSettings(settings) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('realestate_referral_settings', JSON.stringify(settings));
    localStorage.setItem('realestate_referral_settings_permanent', JSON.stringify(settings));
    return Promise.resolve({ success: true });
  }

  async getPayouts() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve([
      {
        id: 1,
        payoutId: 'PAY001',
        affiliateName: 'Sarah Johnson',
        email: 'sarah@example.com',
        amount: 1250,
        method: 'aba',
        requestedOn: '2024-01-20T10:00:00Z',
        status: 'pending'
      },
      {
        id: 2,
        payoutId: 'PAY002',
        affiliateName: 'Mike Wilson',
        email: 'mike@example.com',
        amount: 800,
        method: 'paypal',
        requestedOn: '2024-01-18T14:30:00Z',
        status: 'approved'
      }
    ]);
  }

  async approvePayout(id) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Promise.resolve({ success: true });
  }

  async rejectPayout(id, data) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Promise.resolve({ success: true });
  }

  async getReferralReports(dateRange) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve({
      overview: {
        totalAffiliates: 25,
        totalReferrals: 156,
        totalCommissions: 12500,
        pendingPayouts: 3200
      },
      topAffiliates: [
        { id: 1, name: 'Sarah Johnson', referrals: 25, earnings: 2500 },
        { id: 2, name: 'Mike Wilson', referrals: 18, earnings: 1800 },
        { id: 3, name: 'John Smith', referrals: 15, earnings: 1500 }
      ],
      recentActivity: [
        { description: 'New referral from Sarah Johnson', timestamp: '2 hours ago', amount: 150 },
        { description: 'Payout approved for Mike Wilson', timestamp: '1 day ago' },
        { description: 'New affiliate application received', timestamp: '2 days ago' }
      ]
    });
  }

  async exportReferralReport(type, dateRange) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return Promise.resolve({ success: true });
  }

  async getUserAnalytics(dateRange) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.db.getAll('users');
    const activeUsers = users.filter(user => user.status === 'active');
    
    // Group by user type (role)
    const roleGroups = activeUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    
    const totalActiveUsers = activeUsers.length;
    const roleDistribution = Object.entries(roleGroups).map(([role, count]) => ({
      name: role,
      count,
      percentage: Math.round((count / totalActiveUsers) * 100)
    }));
    
    return Promise.resolve({
      totalUsers: users.length,
      activeUsers: totalActiveUsers,
      newUsers: users.filter(user => new Date(user.joinDate) > new Date('2024-01-20')).length,
      growthRate: '15.2',
      registrationTrend: [
        { month: 'Jan', count: 12 },
        { month: 'Feb', count: 18 },
        { month: 'Mar', count: 25 },
        { month: 'Apr', count: 22 },
        { month: 'May', count: 30 },
        { month: 'Jun', count: 28 }
      ],
      roleDistribution
    });
  }

  async getPropertyAnalytics(dateRange) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve({
      totalProperties: 27,
      activeProperties: 15,
      averagePrice: 875000,
      soldProperties: 1,
      propertyTypes: [
        { type: 'House', count: 3 },
        { type: 'Apartment', count: 2 },
        { type: 'Villa', count: 1 },
        { type: 'Condo', count: 1 },
        { type: 'Studio', count: 1 },
        { type: 'Commercial', count: 1 },
        { type: 'Townhouse', count: 1 }
      ],
      statusDistribution: [
        { name: 'active', count: 2, percentage: 20 },
        { name: 'pending', count: 6, percentage: 60 },
        { name: 'sold', count: 1, percentage: 10 },
        { name: 'rented', count: 1, percentage: 10 }
      ],
      topLocations: [
        { name: 'Beverly Hills, CA', count: 1, avgPrice: 2500000 },
        { name: 'Downtown, NY', count: 1, avgPrice: 850000 },
        { name: 'Austin, TX', count: 1, avgPrice: 450000 },
        { name: 'Seattle, WA', count: 1, avgPrice: 750000 }
      ],
      priceRanges: [
        { range: 'Under $500K', count: 3, percentage: 30 },
        { range: '$500K - $1M', count: 4, percentage: 40 },
        { range: '$1M - $2M', count: 2, percentage: 20 },
        { range: 'Over $2M', count: 1, percentage: 10 }
      ]
    });
  }
}

const apiService = new APIService();
export default apiService;