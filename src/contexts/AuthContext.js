import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';
import EmailService from '../services/emailService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if admin credentials
      if (email === 'admin@realestate.com' && password === 'admin123') {
        const adminUser = {
          id: 1,
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@realestate.com',
          phone: '+1234567895',
          role: 'admin',
          status: 'active',
          joinDate: '2024-01-01',
          lastLogin: new Date().toISOString(),
          avatar: null,
          language: 'English',
          timezone: 'UTC',
          permissions: ['all']
        };
        
        const mockToken = 'admin-jwt-token-' + Date.now();
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(adminUser));
        
        setUser(adminUser);
        setIsAuthenticated(true);
        return { success: true, user: adminUser };
      }
      
      // Check other users from localStorage
      const users = JSON.parse(localStorage.getItem('realestate_users') || '[]');
      console.log('Available users:', users.map(u => ({ email: u.email, hasPassword: !!u.password, status: u.status })));
      console.log('Login attempt:', { email, hasPassword: !!password });
      
      const user = users.find(u => u.email === email && u.password === password && u.status === 'active');
      
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      // Only allow admin users to access admin panel
      if (user.role !== 'admin') {
        return { success: false, error: 'Access denied. Admin credentials required.' };
      }
      
      // Set role-based permissions
      const rolePermissions = {
        admin: ['all'],
        agent: ['properties', 'inquiries', 'transactions', 'dashboard'],
        buyer: ['properties', 'inquiries', 'dashboard'],
        seller: ['properties', 'inquiries', 'transactions', 'dashboard'],
        landlord: ['properties', 'inquiries', 'transactions', 'dashboard'],
        tenant: ['properties', 'inquiries', 'dashboard']
      };
      
      const loggedInUser = {
        ...user,
        permissions: rolePermissions[user.role] || ['dashboard']
      };
      
      const mockToken = 'user-jwt-token-' + Date.now();
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(loggedInUser));
      
      setUser(loggedInUser);
      setIsAuthenticated(true);
      
      // Send login email notification
      try {
        await EmailService.sendLoginEmail(loggedInUser);
      } catch (emailError) {
        console.log('Login email failed:', emailError);
      }
      
      return { success: true, user: loggedInUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    
    // Also update the user in the users array in localStorage
    try {
      const users = JSON.parse(localStorage.getItem('realestate_users') || '[]');
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('realestate_users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Failed to update user in users array:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};