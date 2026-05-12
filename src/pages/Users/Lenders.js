import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';
import { USER_STATUS } from '../../constants';
import toast from 'react-hot-toast';

const Lenders = () => {
  const navigate = useNavigate();
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data for lenders
  useEffect(() => {
    const mockLenders = [
      {
        id: 1,
        firstName: 'Robert',
        lastName: 'Anderson',
        email: 'robert.anderson@lendingcorp.com',
        phone: '+1234567890',
        role: 'lender',
        status: 'active',
        joinDate: '2024-01-15',
        lastLogin: '2024-01-20',
        loansProcessed: 45,
        company: 'Anderson Lending Corp',
        avatar: null
      },
      {
        id: 2,
        firstName: 'Jennifer',
        lastName: 'Martinez',
        email: 'jennifer.martinez@quickloans.com',
        phone: '+1234567891',
        role: 'lender',
        status: 'active',
        joinDate: '2024-01-10',
        lastLogin: '2024-01-19',
        loansProcessed: 32,
        company: 'Quick Loans Inc',
        avatar: null
      },
      {
        id: 3,
        firstName: 'David',
        lastName: 'Thompson',
        email: 'david.thompson@mortgageplus.com',
        phone: '+1234567892',
        role: 'lender',
        status: 'pending',
        joinDate: '2024-01-12',
        lastLogin: '2024-01-18',
        loansProcessed: 18,
        company: 'Mortgage Plus',
        avatar: null
      }
    ];

    setTimeout(() => {
      setLenders(mockLenders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter lenders
  const filteredLenders = lenders.filter(lender => {
    const matchesSearch = 
      lender.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lender.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lender.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lender.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lender.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLenders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLenders = filteredLenders.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lender?')) {
      setLenders(lenders.filter(l => l.id !== id));
      toast.success('Lender deleted successfully');
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
        <h1 className="page-title">Lenders</h1>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/users/add')}
          >
            <Plus size={16} />
            Add Lender
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
                placeholder="Search lenders..."
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

      {/* Lenders Table */}
      <div className="data-table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Lender</th>
                <th>Company</th>
                <th>Status</th>
                <th>Loans Processed</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLenders.map(lender => (
                <tr key={lender.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        {lender.avatar ? (
                          <img src={lender.avatar} alt="" className="w-full h-full rounded-full" />
                        ) : (
                          <span className="text-sm font-medium text-green-600">
                            {getUserInitials(lender.firstName, lender.lastName)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {lender.firstName} {lender.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{lender.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-medium text-gray-900">{lender.company}</span>
                  </td>
                  <td>{getStatusBadge(lender.status)}</td>
                  <td>
                    <span className="font-medium">{lender.loansProcessed}</span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-600">
                      {new Date(lender.joinDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-600">
                      {new Date(lender.lastLogin).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        onClick={() => handleView(lender.id)}
                        className="action-btn view"
                        title="View Lender"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleEdit(lender.id)}
                        className="action-btn edit"
                        title="Edit Lender"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(lender.id)}
                        className="action-btn delete"
                        title="Delete Lender"
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLenders.length)} of {filteredLenders.length} lenders
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
      {filteredLenders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lenders found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/users/add')}
          >
            <Plus size={16} />
            Add First Lender
          </button>
        </div>
      )}
    </div>
  );
};

export default Lenders;