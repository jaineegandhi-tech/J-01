import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { USER_STATUS } from '../../constants';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const UsersByType = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const typeLabels = {
    client: 'Clients',
    agent: 'Agents', 
    lender: 'Lenders',
    developer: 'Developers',
    advertiser: 'Advertisers',
    affiliate: 'Affiliates'
  };

  useEffect(() => {
    loadUsers();
  }, [type]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'realestate_users') {
        loadUsers();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadUsers, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [type]);

  const loadUsers = async () => {
    try {
      // Force fresh data by clearing localStorage first
      localStorage.removeItem('realestate_users');
      
      const userData = await APIService.getUsers();
      console.log('All users loaded:', userData.length);
      console.log('Sample user roles:', userData.slice(0, 5).map(u => u.role));
      console.log('Filtering for type:', type);
      const filteredUsers = userData.filter(user => user.role === type);
      console.log('Filtered users:', filteredUsers.length, filteredUsers.map(u => u.firstName + ' ' + u.lastName));
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="btn btn-secondary"
          >
            <ArrowLeft size={16} />
            Back to All Users
          </button>
          <h1 className="page-title">{typeLabels[type] || 'Users'}</h1>
        </div>
      </div>

      <div className="card">
        <div className="search-container">
          <div className="relative">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder={`Search ${typeLabels[type]?.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(user.status)}</td>
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
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {typeLabels[type]?.toLowerCase()} found</h3>
            <p className="text-gray-600 mb-4">No users of this type have registered yet.</p>
            <button
              onClick={() => navigate(`/admin/users/add?type=${type}`)}
              className="btn btn-primary"
            >
              <Plus size={16} />
              Add {typeLabels[type]?.slice(0, -1) || 'User'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersByType;