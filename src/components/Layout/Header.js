import React, { useState } from 'react';
import { Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuToggle, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'New property inquiry received', time: '5 min ago' },
    { id: 2, message: 'Payment completed for Property #123', time: '10 min ago' },
    { id: 3, message: 'New user registration', time: '15 min ago' }
  ]);

  const getPageTitle = () => {
    const path = window.location.pathname;
    const pathMap = {
      '/admin': 'Dashboard',
      '/admin/profile': 'Profile',
      '/admin/properties': 'Properties',
      '/admin/properties/add': 'Add Property',
      '/admin/properties/types': 'Property Types',
      '/admin/users': 'Users',
      '/admin/users/add': 'Add User',
      '/admin/users/view': 'User Details',
      '/admin/users/edit': 'Edit User',
      '/admin/users/clients': 'Clients',
      '/admin/users/agents': 'Agents',
      '/admin/users/lenders': 'Lenders',
      '/admin/users/advertisers': 'Advertisers',
      '/admin/users/buyers': 'Buyers',
      '/admin/users/sellers': 'Sellers',
      '/admin/promotions': 'Promotions',
      '/admin/promotions/add': 'Create Promotion',
      '/admin/promotions/edit': 'Edit Promotion',
      '/admin/promotions/view': 'Promotion Details',
      '/admin/promotions/codes': 'Promo Codes',
      '/admin/promotions/analytics': 'Promotion Analytics',
      '/admin/transactions': 'Transactions',
      '/admin/inquiries': 'Inquiries',
      '/admin/payments': 'Payments',
      '/admin/reports': 'Reports',
      '/admin/reports/sales': 'Sales Report',
      '/admin/reports/users': 'User Report',
      '/admin/reports/properties': 'Property Report',
      '/admin/settings': 'Settings',
      '/admin/settings/general': 'General Settings',
      '/admin/settings/users': 'User Settings',
      '/admin/settings/system': 'System Settings',
      '/admin/profile/edit': 'Edit Profile',
      '/admin/profile/change-password': 'Change Password',
      '/admin/profile/activity': 'Activity Logs'
    };
    return pathMap[path] || 'Dashboard';
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate('/admin/profile');
  };

  const handleChangePasswordClick = () => {
    setShowUserMenu(false);
    navigate('/admin/profile/change-password');
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    navigate('/admin/settings');
  };

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <header className={`header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={onMenuToggle}
        >
          <Menu size={20} />
        </button>
        <h1 className="header-title">{getPageTitle()}</h1>
      </div>
      
      <div className="header-actions">
        {/* Notifications */}
        <div className="notification-wrapper">
          <button className="notification-btn">
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>
        </div>
        
        {/* User Menu */}
        <div className="user-menu">
          <button
            className="user-avatar"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              getUserInitials()
            )}
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-info">
                  <p className="user-name">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>
              
              <div className="user-dropdown-divider"></div>
              
              <button className="user-dropdown-item" onClick={handleProfileClick}>
                <User size={16} />
                <span>Profile</span>
              </button>
              
              <button className="user-dropdown-item" onClick={handleChangePasswordClick}>
                <Settings size={16} />
                <span>Change Password</span>
              </button>
              
              <button className="user-dropdown-item" onClick={handleSettingsClick}>
                <Settings size={16} />
                <span>Settings</span>
              </button>
              
              <div className="user-dropdown-divider"></div>
              
              <button 
                className="user-dropdown-item logout-item"
                onClick={handleLogoutClick}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="dropdown-overlay"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="logout-modal">
            <div className="logout-modal-header">
              <h3 className="logout-modal-title">Confirm Logout</h3>
            </div>
            <div className="logout-modal-body">
              <p>Are you sure you want to logout? You will need to sign in again to access your account.</p>
            </div>
            <div className="logout-modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={cancelLogout}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;