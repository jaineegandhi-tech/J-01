import React, { useState, useEffect } from 'react';
import { Search, DollarSign, Calendar, Check, X, Download } from 'lucide-react';
import { PAYOUT_METHODS } from '../../constants';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      const data = await APIService.getPayouts();
      setPayouts(data);
    } catch (error) {
      toast.error('Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this payout?')) {
      try {
        await APIService.approvePayout(id);
        toast.success('Payout approved successfully!');
        loadPayouts();
      } catch (error) {
        toast.error('Failed to approve payout');
      }
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      try {
        await APIService.rejectPayout(id, { reason });
        toast.success('Payout rejected successfully!');
        loadPayouts();
      } catch (error) {
        toast.error('Failed to reject payout');
      }
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.payoutId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', color: '#92400e' },
      approved: { bg: '#dcfce7', color: '#166534' },
      rejected: { bg: '#fee2e2', color: '#991b1b' },
      completed: { bg: '#dbeafe', color: '#1e40af' }
    };
    const config = colors[status] || colors.pending;
    return (
      <span 
        className="status-badge"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
        <h1 className="page-title">Payout Management</h1>
        <button className="btn btn-secondary">
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="card">
        <div className="filters-container">
          <div className="search-container">
            <div className="relative">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search by affiliate name or payout ID..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payout ID</th>
                <th>Affiliate</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Requested On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.map(payout => (
                <tr key={payout.id}>
                  <td className="font-mono text-sm">{payout.payoutId}</td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium">{payout.affiliateName}</span>
                      <span className="text-sm text-gray-500">{payout.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-500" />
                      <span className="font-medium">${payout.amount.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="capitalize">{payout.method}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{new Date(payout.requestedOn).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(payout.status)}</td>
                  <td>
                    <div className="table-actions">
                      {payout.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(payout.id)}
                            className="action-btn edit"
                            title="Approve"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={() => handleReject(payout.id)}
                            className="action-btn delete"
                            title="Reject"
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

      {filteredPayouts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payouts found</h3>
          <p className="text-gray-600">Payout requests will appear here</p>
        </div>
      )}
    </div>
  );
};

export default PayoutManagement;