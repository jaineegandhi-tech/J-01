import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';
import { USER_ROLES, USER_STATUS } from '../../constants';
import APIService from '../../services/api';
import CrossPortSync from '../../utils/crossPortSync';
import toast from 'react-hot-toast';

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [crossPortSync] = useState(new CrossPortSync());

  // Load users from API
  useEffect(() => {
    loadUsers();
    
    // Check for roleId query parameter
    const params = new URLSearchParams(location.search);
    const roleIdParam = params.get('roleId');
    if (roleIdParam) {
      setRoleFilter(roleIdParam);
    }
  }, [location.search]);

  // Auto sync from server every 2 seconds for real-time updates
  useEffect(() => {
    const autoSync = async () => {
      try {
        const response = await fetch('http://localhost:3005/get-users');
        const serverUsers = await response.json();
        const currentUsers = JSON.parse(localStorage.getItem('realestate_users') || '[]');
        
        let newUsersAdded = 0;
        serverUsers.forEach(serverUser => {
          if (!currentUsers.find(u => u.email === serverUser.email)) {
            currentUsers.push(serverUser);
            newUsersAdded++;
          }
        });
        
        if (newUsersAdded > 0) {
          localStorage.setItem('realestate_users', JSON.stringify(currentUsers));
          localStorage.setItem('realestate_users_permanent', JSON.stringify(currentUsers));
          loadUsers(); // Reload through API to maintain seed data
          toast.success(`🔄 Auto-synced ${newUsersAdded} new user(s) from User App`);
        }
      } catch (error) {
        console.log('Auto-sync failed:', error);
      }
    };
    
    const interval = setInterval(autoSync, 2000); // Check every 2 seconds
    autoSync(); // Run once immediately
    
    return () => clearInterval(interval);
  }, []);

  const loadUsers = async () => {
    try {
      // Debug localStorage content
      console.log('=== ADMIN PANEL DEBUG ===');
      console.log('localStorage realestate_users:', localStorage.getItem('realestate_users'));
      
      // Force refresh from localStorage to get latest data
      const userData = await APIService.getUsers();
      console.log('Loaded users from API:', userData.length);
      console.log('First few users:', userData.slice(0, 3));
      setUsers(userData);
    } catch (error) {
      console.error('Load users error:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter || (user.roleId && user.roleId.toString() === roleFilter);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await APIService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = USER_STATUS.find(s => s.value === status);
    return (
      <span 
        className="status-badge"
        style={{ 
          backgroundColor: `${statusConfig?.color}20`,
          color: statusConfig?.color 
        }}
      >
        {statusConfig?.label || status}
      </span>
    );
  };

  const getRoleBadge = (user) => {
    const roleConfig = USER_ROLES.find(r => r.value === user.role);
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {roleConfig?.label || user.role}
      </span>
    );
  };

  const getUserInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <div className="page-actions">
          <button 
            className="btn btn-secondary"
            onClick={async () => {
              try {
                const response = await fetch('http://localhost:3005/get-users');
                const serverUsers = await response.json();
                const currentUsers = JSON.parse(localStorage.getItem('realestate_users') || '[]');
                
                let syncedCount = 0;
                serverUsers.forEach(serverUser => {
                  if (!currentUsers.find(u => u.email === serverUser.email)) {
                    currentUsers.push(serverUser);
                    syncedCount++;
                  }
                });
                
                if (syncedCount > 0) {
                  localStorage.setItem('realestate_users', JSON.stringify(currentUsers));
                  localStorage.setItem('realestate_users_permanent', JSON.stringify(currentUsers));
                  loadUsers();
                  toast.success(`✅ Manually synced ${syncedCount} new user(s)`);
                } else {
                  toast.info('📋 No new users to sync');
                }
              } catch (error) {
                toast.error('❌ Manual sync failed: ' + error.message);
              }
            }}
          >
            🔄 Manual Sync
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/admin/users/add')}
          >
            <Plus size={16} />
            Add User
          </button>
          <button 
            className="btn btn-success"
            onClick={() => {
              // Restore seed data
              APIService.db.seedData();
              toast.success('🌱 Seed data restored');
              loadUsers();
            }}
          >
            🌱 Restore Seed Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="filters-container">
          <div className="search-container">
            <div className="relative">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filters-group">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All User Types</option>
              {USER_ROLES.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              {USER_STATUS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="data-table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>User Type</th>
                <th>Status</th>
                <th>Properties</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full rounded-full" />
                        ) : (
                          <span className="text-sm font-medium text-blue-600">
                            {getUserInitials(user.firstName, user.lastName)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{getRoleBadge(user)}</td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>
                    <span className="font-medium">{user.propertiesCount}</span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-600">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-600">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => navigate(`/admin/users/view/${user.id}`)}
                        title="View User Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                        title="Edit User"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="action-btn delete"
                        title="Delete User"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="pagination-wrapper">
              <div className="pagination-controls">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/admin/users/add')}
          >
            <Plus size={16} />
            Add First User
          </button>
        </div>
      )}
    </div>
  );
};

export default Users;