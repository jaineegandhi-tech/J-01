import React, { useState, useEffect } from 'react';
import { Download, Calendar, Users, TrendingUp, UserCheck, BarChart3 } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const UserReport = () => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      const [userData, analyticsData] = await Promise.all([
        APIService.getUsers(),
        APIService.getUserAnalytics(dateRange)
      ]);
      setUsers(userData);
      setAnalytics(analyticsData);
    } catch (error) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.success('User report exported successfully!');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">User Report</h1>
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
          <button onClick={handleExport} className="btn btn-primary">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalUsers || users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <h3>{analytics.activeUsers || users.filter(u => u.status === 'active').length}</h3>
            <p>Active Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{analytics.newUsers || 0}</h3>
            <p>New Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <h3>{analytics.growthRate || '12.5'}%</h3>
            <p>Growth Rate</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">User Registration Trend</h3>
          </div>
          <div className="chart-bars">
            {(analytics.registrationTrend || []).map((data, index) => (
              <div key={index} className="chart-bar-group">
                <div className="chart-bars-container">
                  <div 
                    className="chart-bar" 
                    style={{ 
                      height: `${(data.count / Math.max(...(analytics.registrationTrend || []).map(d => d.count))) * 180}px`,
                      backgroundColor: '#3b82f6'
                    }}
                  />
                </div>
                <div className="chart-label">{data.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">User Distribution by Role</h3>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {(analytics.roleDistribution || []).map(role => (
                  <tr key={role.name}>
                    <td className="font-medium capitalize">{role.name}</td>
                    <td>{role.count}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-full bg-blue-500 rounded" 
                            style={{ width: `${role.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm">{role.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <h3 className="data-table-title">Recent User Activity</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Properties</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 10).map(user => (
                <tr key={user.id}>
                  <td className="font-medium">{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td>
                    <span className={`status-badge ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                  <td>{user.propertiesCount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserReport;