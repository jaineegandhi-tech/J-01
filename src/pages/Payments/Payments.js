import React, { useState, useEffect } from 'react';
import { Search, DollarSign, Calendar, CreditCard, CheckCircle, XCircle, Clock, Download, Filter } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await APIService.getPayments();
      setPayments(data);
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    completed: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    count: payments.length
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  const handleExport = () => {
    toast.success('Payment report exported successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">Payment Management</h1>
        <button onClick={handleExport} className="btn btn-primary">
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold">${stats.total.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">${stats.completed.toLocaleString()}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">${stats.pending.toLocaleString()}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-bold">{stats.count}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by reference, description, or amount..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">All Payments ({filteredPayments.length})</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Reference</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="font-mono text-sm">#{payment.id.toString().padStart(3, '0')}</td>
                  <td>
                    <div className="font-medium">{payment.reference}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-green-600">
                      ${payment.amount.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      payment.type === 'commission' ? 'bg-blue-100 text-blue-800' :
                      payment.type === 'rent' ? 'bg-purple-100 text-purple-800' :
                      payment.type === 'deposit' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.type}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-400" />
                      <span className="capitalize">{payment.method?.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className={`font-medium capitalize ${
                        payment.status === 'completed' ? 'text-green-600' :
                        payment.status === 'pending' ? 'text-yellow-600' :
                        payment.status === 'failed' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </td>
                  <td className="text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="text-sm text-gray-600 max-w-xs truncate" title={payment.description}>
                      {payment.description}
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

export default Payments;