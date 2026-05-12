import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Shield, Users, Edit, Trash2, Eye, Power } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const Roles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await APIService.getRoles();
      setRoles(data);
    } catch (error) {
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.id.toString().includes(searchTerm);
    const matchesType = typeFilter === 'all' || role.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || role.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async (id) => {
    const role = roles.find(r => r.id === id);
    if (!role) {
      toast.error('Role not found');
      return;
    }
    
    if ((role.userCount || 0) > 0) {
      toast.error('Cannot delete role with assigned users');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`)) {
      try {
        await APIService.deleteRole(id);
        setRoles(prev => prev.filter(r => r.id !== id));
        toast.success('Role deleted successfully');
      } catch (error) {
        console.error('Delete role error:', error);
        toast.error('Failed to delete role. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const role = roles.find(r => r.id === id);
      const newStatus = role.status === 'active' ? 'inactive' : 'active';
      await APIService.updateRole(id, { status: newStatus });
      setRoles(roles.map(r => r.id === id ? { ...r, status: newStatus } : r));
      toast.success(`Role ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update role status');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Roles & Permissions</h1>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/admin/roles/create')}
          >
            <Plus size={16} />
            Create New Role
          </button>
        </div>
      </div>

      <div className="card">
        <div className="filters-container">
          <div className="search-container">
            <div className="relative">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filters-group">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Type</th>
                <th>Description</th>
                <th>Users</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.id}>
                  <td>
                    <div>
                      <div className="font-medium text-gray-900">
                        {role.name}
                      </div>
                      <div className="text-sm text-gray-500">#{role.id}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      role.type === 'internal' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {role.type}
                    </span>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900 max-w-xs">
                      <p className="truncate">{role.description || 'No description provided'}</p>
                    </div>
                  </td>
                  <td>
                    <span className="font-medium">{role.userCount || 0}</span>
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: role.status === 'active' ? '#10b98120' : '#ef444420',
                        color: role.status === 'active' ? '#10b981' : '#ef4444'
                      }}
                    >
                      {role.status}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-600">
                      {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => navigate(`/admin/roles/${role.id}`)}
                        title="View Role Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => navigate(`/admin/roles/edit/${role.id}`)}
                        title="Edit Role"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(role.id)}
                        className="action-btn edit"
                        title={role.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <Power size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(role.id)}
                        className="action-btn delete"
                        title="Delete Role"
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

        {filteredRoles.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria to find the roles you\'re looking for.'
                : 'Get started by creating your first role to manage user permissions and access control.'}
            </p>
            {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && (
              <button
                onClick={() => navigate('/admin/roles/create')}
                className="btn btn-primary"
              >
                <Plus size={16} />
                Create New Role
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Roles;