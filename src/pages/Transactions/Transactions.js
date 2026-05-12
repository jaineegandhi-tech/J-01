import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, DollarSign, Calendar, User } from 'lucide-react';
import { TRANSACTION_STATUS, TRANSACTION_TYPES } from '../../constants';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Load transactions from API
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const transactionData = await APIService.getTransactions();
      setTransactions(transactionData);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    const statusConfig = TRANSACTION_STATUS.find(s => s.value === status);
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

  const getTypeBadge = (type) => {
    const typeConfig = TRANSACTION_TYPES.find(t => t.value === type);
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {typeConfig?.label || type}
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
        <h1 className="page-title">Transactions</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="stat-icon green">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>$3.15M</h3>
            <p>Total Volume</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>23</h3>
            <p>This Month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3>5</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>$157K</h3>
            <p>Commission</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Status</option>
            {TRANSACTION_STATUS.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Types</option>
            {TRANSACTION_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="data-table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Agent</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>
                    <div className="font-medium text-gray-900">
                      {transaction.propertyTitle}
                    </div>
                  </td>
                  <td>{getTypeBadge(transaction.type)}</td>
                  <td>
                    <span className="font-semibold text-green-600">
                      ${transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td>{transaction.buyerName || transaction.buyer}</td>
                  <td>{transaction.sellerName || transaction.seller}</td>
                  <td>{transaction.agentName || transaction.agent}</td>
                  <td>{getStatusBadge(transaction.status)}</td>
                  <td>
                    <span className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn view">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;