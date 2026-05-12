import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';
import { USER_STATUS, USER_ROLES } from '../../constants';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const [userData, rolesData] = await Promise.all([
        APIService.getUsers(),
        APIService.getRoles()
      ]);
      // Filter for client-type users
      const clientUsers = userData.filter(user => 
        user.role === 'buyer' || user.role === 'tenant' || user.role === 'client'
      );
      setClients(clientUsers);
      setRoles(rolesData);
    } catch (error) {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await APIService.deleteUser(id);
        setClients(clients.filter(c => c.id !== id));
        toast.success('Client deleted successfully');
      } catch (error) {
        toast.error('Failed to delete client');
      }
    }
  };

  const handleView = (id) => {
    navigate(`/users/view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/users/edit/${id}`);
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

  const getUserInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getRoleBadge = (user) => {
    if (user.roleId) {
      const roleData = roles.find(r => r.id === user.roleId);
      if (roleData) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {roleData.name} ({roleData.type})
          </span>
        );
      }
    }
    
    const roleConfig = USER_ROLES.find(r => r.value === user.role);
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {roleConfig?.label || user.role}
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
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Clients</h1>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/users/add')}
          >
            <Plus size={16} />
            Add Client
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
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filters-group">
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

      {/* Clients Table */}
      <div className="data-table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Role</th>
                <th>Status</th>
                <th>Properties</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.map(client => (
                <tr key={client.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {client.avatar ? (
                          <img src={client.avatar} alt="" className="w-full h-full rounded-full" />
                        ) : (
                          <span className="text-sm font-medium text-blue-600">
                            {getUserInitials(client.firstName, client.lastName)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {client.firstName} {client.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{getRoleBadge(client)}</td>
                  <td>{getStatusBadge(client.status)}</td>
                  <td>
                    <span className="font-medium">{client.propertiesCount || 0}</span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-600">
                      {new Date(client.joinDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-600">
                      {new Date(client.lastLogin).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        onClick={() => handleView(client.id)}
                        className="action-btn view"
                        title="View Client"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleEdit(client.id)}
                        className="action-btn edit"
                        title="Edit Client"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id)}
                        className="action-btn delete"
                        title="Delete Client"
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClients.length)} of {filteredClients.length} clients
            </div>
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
        )}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/users/add')}
          >
            <Plus size={16} />
            Add First Client
          </button>
        </div>
      )}
    </div>
  );
};

export default Clients;