import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, DollarSign, Users, TrendingUp } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const ActiveAffiliates = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAffiliates();
  }, []);

  const loadAffiliates = async () => {
    try {
      const data = await APIService.getActiveAffiliates();
      setAffiliates(data);
    } catch (error) {
      toast.error('Failed to load affiliates');
    } finally {
      setLoading(false);
    }
  };

  const filteredAffiliates = affiliates.filter(affiliate =>
    affiliate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="page-title">Active Affiliates</h1>
      </div>

      <div className="card">
        <div className="search-container">
          <div className="relative">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search affiliates..."
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
                <th>Affiliate</th>
                <th>Referral Code</th>
                <th>Total Referrals</th>
                <th>Total Earnings</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAffiliates.map(affiliate => (
                <tr key={affiliate.id}>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium">{affiliate.fullName}</span>
                      <span className="text-sm text-gray-500">{affiliate.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                      {affiliate.referralCode}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-blue-500" />
                      <span className="font-medium">{affiliate.totalReferrals}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-500" />
                      <span className="font-medium">${affiliate.totalEarnings.toLocaleString()}</span>
                    </div>
                  </td>
                  <td>{new Date(affiliate.joinDate).toLocaleDateString()}</td>
                  <td>
                    <span className="status-badge" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                      Active
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link 
                        to={`/referrals/affiliates/${affiliate.id}`}
                        className="action-btn view"
                      >
                        <Eye size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAffiliates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active affiliates found</h3>
          <p className="text-gray-600">Approved affiliates will appear here</p>
        </div>
      )}
    </div>
  );
};

export default ActiveAffiliates;