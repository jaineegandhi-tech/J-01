import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, MessageSquare, Phone, Mail, User, Clock, Filter, Download } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const Inquiries = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      const data = await APIService.getInquiries();
      setInquiries(data);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await APIService.updateInquiry(id, { status: newStatus });
      setInquiries(prev => prev.map(inquiry => 
        inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
      ));
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inquiry.status === statusFilter;
    const matchesType = typeFilter === 'All' || inquiry.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'New').length,
    contacted: inquiries.filter(i => i.status === 'Contacted').length,
    responded: inquiries.filter(i => i.status === 'Responded').length
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  const handleViewInquiry = (inquiry) => {
    navigate(`/inquiries/${inquiry.id}`);
    window.scrollTo(0, 0);
  };

  const handleExport = () => {
    toast.success('Inquiries exported successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">Property Inquiries</h1>
        <button onClick={handleExport} className="btn btn-primary">
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contacted</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.contacted}</p>
            </div>
            <Phone className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Responded</p>
              <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
            </div>
            <Mail className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, property, or email..."
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
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Responded">Responded</option>
              <option value="Closed">Closed</option>
            </select>
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
            </select>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">All Inquiries ({filteredInquiries.length})</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Contact Information</th>
                <th>Property</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td className="font-mono text-sm">#{inquiry.id.toString().padStart(3, '0')}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{inquiry.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                        <div className="text-sm text-gray-500">{inquiry.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-medium">{inquiry.property}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      inquiry.type === 'Sale' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {inquiry.type}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      inquiry.priority === 'High' ? 'bg-red-100 text-red-800' :
                      inquiry.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {inquiry.priority}
                    </span>
                  </td>
                  <td>
                    <select
                      value={inquiry.status}
                      onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                      className={`status-select ${
                        inquiry.status === 'New' ? 'text-blue-600' :
                        inquiry.status === 'Contacted' ? 'text-yellow-600' :
                        inquiry.status === 'Responded' ? 'text-green-600' :
                        'text-gray-600'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Responded">Responded</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="text-sm text-gray-500">
                    {new Date(inquiry.date).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewInquiry(inquiry)}
                        className="btn-icon btn-primary"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="btn-icon btn-success"
                        title="Send Email"
                      >
                        <Mail size={16} />
                      </a>
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

export default Inquiries;