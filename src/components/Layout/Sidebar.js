import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  BarChart3, 
  Building2, 
  Users, 
  CreditCard, 
  MessageSquare, 
  DollarSign, 
  FileText, 
  Settings,
  ChevronRight,
  Tag,
  Shield,
  Users2
} from 'lucide-react';
import { MENU_ITEMS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/permissions';

const iconMap = {
  BarChart3,
  Building2,
  Users,
  CreditCard,
  MessageSquare,
  DollarSign,
  FileText,
  Settings,
  ChevronRight,
  Tag,
  Shield,
  Users2
};

const Sidebar = ({ collapsed, mobileOpen, onToggle, onMobileToggle }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState({});

  const getPermissionForMenuItem = (key) => {
    const permissionMap = {
      'dashboard': 'dashboard',
      'users': 'users',
      'properties': 'properties',
      'transactions': 'transactions',
      'inquiries': 'inquiries',
      'payments': 'payments',
      'reports': 'reports',
      'roles': 'roles',
      'referrals': 'referrals',
      'settings': 'settings',
      'promotions': 'promotions'
    };
    return permissionMap[key] || key;
  };

  const filterMenuItems = (items) => {
    return items.filter(item => {
      const permission = getPermissionForMenuItem(item.key);
      return hasPermission(user, permission);
    });
  };

  const toggleExpanded = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (item) => {
    if (item.children) {
      return item.children.some(child => isActive(child.path));
    }
    return isActive(item.path);
  };

  const renderMenuItem = (item) => {
    const Icon = iconMap[item.icon];
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.key];
    const parentActive = isParentActive(item);

    if (hasChildren) {
      return (
        <div key={item.key} className="nav-item">
          <button
            className={`nav-link ${parentActive ? 'active' : ''}`}
            onClick={() => toggleExpanded(item.key)}
          >
            <Icon className="nav-icon" />
            <span className="nav-text">{item.label}</span>
            <ChevronRight className={`nav-arrow ${isExpanded ? 'expanded' : ''}`} />
          </button>
          <div className={`nav-submenu ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {item.children.map(child => (
              <Link
                key={child.key}
                to={child.path}
                className={`nav-link ${isActive(child.path) ? 'active' : ''}`}
                onClick={() => window.innerWidth <= 768 && onMobileToggle()}
              >
                <span className="nav-text">{child.label}</span>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={item.key} className="nav-item">
        <Link
          to={item.path}
          className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
          onClick={() => window.innerWidth <= 768 && onMobileToggle()}
        >
          <Icon className="nav-icon" />
          <span className="nav-text">{item.label}</span>
        </Link>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileToggle}
        />
      )}
      
      <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">RealEstate</div>
          <button className="sidebar-toggle" onClick={onToggle}>
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {filterMenuItems(MENU_ITEMS).map(renderMenuItem)}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;