import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const ReferralReports = () => {
  const [reports, setReports] = useState({
    overview: {},
    topAffiliates: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
    try {
      const data = await APIService.getReferralReports(dateRange);
      setReports(data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      await APIService.exportReferralReport(type, dateRange);
      toast.success('Report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
    }
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
        <h1 className="page-title">Reports & Audits</h1>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button onClick={() => handleExport('overview')} className="btn btn-secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{reports.overview.totalAffiliates || 0}</h3>
            <p>Total Affiliates</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{reports.overview.totalReferrals || 0}</h3>
            <p>Total Referrals</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>${(reports.overview.totalCommissions || 0).toLocaleString()}</h3>
            <p>Total Commissions</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>${(reports.overview.pendingPayouts || 0).toLocaleString()}</h3>
            <p>Pending Payouts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">Top Performing Affiliates</h3>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Affiliate Name</th>
                  <th>Referrals</th>
                  <th>Earnings</th>
                </tr>
              </thead>
              <tbody>
                {reports.topAffiliates.map((affiliate, index) => (
                  <tr key={affiliate.id}>
                    <td>
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-xs">
                        {index + 1}
                      </div>
                    </td>
                    <td className="font-medium">{affiliate.name}</td>
                    <td>{affiliate.referrals}</td>
                    <td className="font-semibold text-green-600">${affiliate.earnings.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">Recent Activity</h3>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Time</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {reports.recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td className="font-medium">{activity.description}</td>
                    <td className="text-sm text-gray-500">{activity.timestamp}</td>
                    <td>
                      {activity.amount ? (
                        <span className="font-semibold text-green-600">
                          +${activity.amount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralReports;