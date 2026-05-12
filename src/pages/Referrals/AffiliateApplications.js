import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Check, X, RefreshCw } from 'lucide-react';
import { APPLICATION_STATUS, REFERRAL_MODES, AFFILIATE_USER_TYPES } from '../../constants';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const AffiliateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await APIService.getAffiliateApplications();
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this application?')) {
      try {
        await APIService.approveAffiliateApplication(id);
        toast.success('Application approved successfully!');
        loadApplications();
      } catch (error) {
        toast.error('Failed to approve application');
      }
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      try {
        await APIService.rejectAffiliateApplication(id, { reason });
        toast.success('Application rejected successfully!');
        loadApplications();
      } catch (error) {
        toast.error('Failed to reject application');
      }
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.userType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    const statusConfig = APPLICATION_STATUS.find(s => s.value === status);
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
        <h1 className="page-title">Affiliate Applications</h1>
        <button onClick={loadApplications} className="btn btn-secondary">
          <RefreshCw size={16} />
          Refresh List
        </button>
      </div>

      <div className="card">
        <div className="filters-container">
          <div className="search-container">
            <div className="relative">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
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
              {APPLICATION_STATUS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {AFFILIATE_USER_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>User Type</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(application => (
                <tr key={application.id}>
                  <td className="font-mono text-sm">{application.applicationId}</td>
                  <td className="font-medium">{application.fullName}</td>
                  <td>{application.email}</td>
                  <td>{application.phone}</td>
                  <td className="capitalize">{application.userType}</td>
                  <td>{new Date(application.appliedOn).toLocaleDateString()}</td>
                  <td>{getStatusBadge(application.status)}</td>
                  <td>
                    <div className="table-actions">
                      <Link 
                        to={`/referrals/applications/${application.id}`}
                        className="action-btn view"
                      >
                        <Eye size={14} />
                      </Link>
                      {application.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(application.id)}
                            className="action-btn edit"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={() => handleReject(application.id)}
                            className="action-btn delete"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AffiliateApplications;