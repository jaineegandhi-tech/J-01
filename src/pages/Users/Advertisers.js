import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';
import { USER_STATUS } from '../../constants';
import toast from 'react-hot-toast';

const Advertisers = () => {
  const navigate = useNavigate();
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data for advertisers
  useEffect(() => {
    const mockAdvertisers = [
      {
        id: 1,
        firstName: 'Amanda',
        lastName: 'Rodriguez',
        email: 'amanda.rodriguez@adagency.com',
        phone: '+1234567890',
        role: 'advertiser',
        status: 'active',
        joinDate: '2024-01-15',
        lastLogin: '2024-01-20',
        campaignsActive: 8,
        company: 'Rodriguez Ad Agency',
        avatar: null
      },
      {
        id: 2,
        firstName: 'James',
        lastName: 'Parker',
        email: 'james.parker@digitalads.com',
        phone: '+1234567891',
        role: 'advertiser',
        status: 'active',
        joinDate: '2024-01-10',
        lastLogin: '2024-01-19',
        campaignsActive: 12,
        company: 'Digital Ads Pro',
        avatar: null
      },
      {
        id: 3,
        firstName: 'Lisa',
        lastName: 'Chen',
        email: 'lisa.chen@marketingplus.com',
        phone: '+1234567892',
        role: 'advertiser',
        status: 'pending',
        joinDate: '2024-01-12',
        lastLogin: '2024-01-18',
        campaignsActive: 5,
        company: 'Marketing Plus',
        avatar: null
      }
    ];

    setTimeout(() => {
      setAdvertisers(mockAdvertisers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter advertisers
  const filteredAdvertisers = advertisers.filter(advertiser => {
    const matchesSearch = 
      advertiser.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advertiser.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advertiser.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advertiser.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || advertiser.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAdvertisers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAdvertisers = filteredAdvertisers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this advertiser?')) {
      setAdvertisers(advertisers.filter(a => a.id !== id));
      toast.success('Advertiser deleted successfully');
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
        <h1 className="page-title">Advertisers</h1>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/users/add')}
          >
            <Plus size={16} />
            Add Advertiser
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
                placeholder="Search advertisers..."
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

      {/* Advertisers Table */}
      <div className="data-table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Advertiser</th>
                <th>Company</th>
                <th>Status</th>
                <th>Active Campaigns</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAdvertisers.map(advertiser => (
                <tr key={advertiser.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {advertiser.avatar ? (
                          <img src={advertiser.avatar} alt="" className="w-full h-full rounded-full" />
                        ) : (
                          <span className="text-sm font-medium text-purple-600">
                            {getUserInitials(advertiser.firstName, advertiser.lastName)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {advertiser.firstName} {advertiser.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{advertiser.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-medium text-gray-900">{advertiser.company}</span>
                  </td>
                  <td>{getStatusBadge(advertiser.status)}</td>
                  <td>
                    <span className="font-medium">{advertiser.campaignsActive}</span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-600">
                      {new Date(advertiser.joinDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-600">
                      {new Date(advertiser.lastLogin).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        onClick={() => handleView(advertiser.id)}
                        className="action-btn view"
                        title="View Advertiser"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleEdit(advertiser.id)}
                        className="action-btn edit"
                        title="Edit Advertiser"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(advertiser.id)}
                        className="action-btn delete"
                        title="Delete Advertiser"
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAdvertisers.length)} of {filteredAdvertisers.length} advertisers
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
      {filteredAdvertisers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisers found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/users/add')}
          >
            <Plus size={16} />
            Add First Advertiser
          </button>
        </div>
      )}
    </div>
  );
};

export default Advertisers;