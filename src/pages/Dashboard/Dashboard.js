import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  MessageSquare,
  Eye,
  Calendar,
  MapPin
} from 'lucide-react';
import APIService from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashboardStats = await APIService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleCardClick = (route, filter = null) => {
    if (filter) {
      navigate(route, { state: { filter } });
    } else {
      navigate(route);
    }
  };

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'property',
      message: 'New property listed in Downtown',
      time: '2 minutes ago',
      icon: Building2
    },
    {
      id: 2,
      type: 'user',
      message: 'New agent registered',
      time: '5 minutes ago',
      icon: Users
    },
    {
      id: 3,
      type: 'inquiry',
      message: 'Property inquiry received',
      time: '10 minutes ago',
      icon: MessageSquare
    },
    {
      id: 4,
      type: 'sale',
      message: 'Property sold for $450,000',
      time: '15 minutes ago',
      icon: DollarSign
    }
  ]);

  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const analytics = await APIService.getUserAnalytics();
      const roleStats = {};
      
      // Convert role distribution to the format expected by the chart
      analytics.roleDistribution.forEach(role => {
        roleStats[role.name] = role.count;
      });
      
      setUserStats(roleStats);
    } catch (error) {
      console.error('Failed to load user stats');
    }
  };

  const [topProperties] = useState([
    {
      id: 1,
      title: 'Luxury Villa in Beverly Hills',
      price: '$2,500,000',
      views: 1234,
      inquiries: 45,
      image: '/api/placeholder/100/80'
    },
    {
      id: 2,
      title: 'Modern Apartment Downtown',
      price: '$850,000',
      views: 987,
      inquiries: 32,
      image: '/api/placeholder/100/80'
    },
    {
      id: 3,
      title: 'Family House in Suburbs',
      price: '$650,000',
      views: 756,
      inquiries: 28,
      image: '/api/placeholder/100/80'
    }
  ]);

  // Chart data - dynamically generate from actual user types
  const userTypes = Object.keys(userStats);
  const activeUsersChartData = {
    labels: userTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1) + 's'),
    datasets: [
      {
        label: 'Active Users',
        data: userTypes.map(type => userStats[type] || 0),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red for Admins
          'rgba(59, 130, 246, 0.8)',  // Blue for Agents
          'rgba(16, 185, 129, 0.8)',  // Green for Buyers
          'rgba(245, 158, 11, 0.8)',  // Yellow for Sellers
          'rgba(139, 92, 246, 0.8)',  // Purple for Landlords
          'rgba(236, 72, 153, 0.8)'   // Pink for Tenants
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)'
        ],
        borderWidth: 2,
      }
    ],
  };

  const propertyTypeData = {
    labels: ['Apartments', 'Houses', 'Villas', 'Commercial', 'Land'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6'
        ],
        borderWidth: 0,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [120000, 135000, 148000, 162000, 155000, 175000],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="stats-grid">
        <div 
          className="stat-card clickable-card" 
          onClick={() => handleCardClick('/admin/properties')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick('/admin/properties')}
        >
          <div className="stat-icon blue">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalProperties?.toLocaleString() || 0}</h3>
            <p>Total Properties</p>
          </div>
        </div>

        <div 
          className="stat-card clickable-card" 
          onClick={() => handleCardClick('/admin/properties', { status: 'active' })}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick('/admin/properties', { status: 'active' })}
        >
          <div className="stat-icon green">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.activeProperties?.toLocaleString() || 0}</h3>
            <p>Active Listings</p>
          </div>
        </div>

        <div 
          className="stat-card clickable-card" 
          onClick={() => handleCardClick('/admin/users')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick('/admin/users')}
        >
          <div className="stat-icon purple">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers?.toLocaleString() || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div 
          className="stat-card clickable-card" 
          onClick={() => handleCardClick('/admin/payments')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick('/admin/payments')}
        >
          <div className="stat-icon yellow">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>${stats.monthlyRevenue?.toLocaleString() || 0}</h3>
            <p>Monthly Revenue</p>
          </div>
        </div>

        <div 
          className="stat-card clickable-card" 
          onClick={() => handleCardClick('/admin/inquiries')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick('/admin/inquiries')}
        >
          <div className="stat-icon red">
            <MessageSquare size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.pendingInquiries || 0}</h3>
            <p>Pending Inquiries</p>
          </div>
        </div>

        <div 
          className="stat-card clickable-card" 
          onClick={() => handleCardClick('/admin/properties')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick('/admin/properties')}
        >
          <div className="stat-icon blue">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.activeProperties || 0}</h3>
            <p>New This Month</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="chart-row">
        {/* Active Users Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Active Users by Role</h3>
            <p className="text-sm text-gray-600">Current active users in the system</p>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <Bar data={activeUsersChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.label}: ${context.parsed.y} active users`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  },
                  title: {
                    display: true,
                    text: 'Users'
                  }
                },
                x: {
                  title: {
                    display: false
                  }
                }
              }
            }} />
          </div>
        </div>

        {/* Property Types Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Property Types Distribution</h3>
            <p className="text-sm text-gray-600">Breakdown of property listings</p>
          </div>
          <div className="flex justify-center">
            <div style={{ width: '300px', height: '300px' }}>
              <Doughnut data={propertyTypeData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* User Activity Summary Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Active Users Summary</h3>
          <p className="text-sm text-gray-600">Detailed breakdown of active users by role and status</p>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Role</th>
                <th>Active Count</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(userStats).map(([role, count], index) => {
                const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'orange'];
                const color = colors[index % colors.length];
                const totalUsers = Object.values(userStats).reduce((a, b) => a + b, 0);
                const percentage = totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : 0;
                
                return (
                  <tr key={role}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 bg-${color}-500 rounded-full`}></div>
                        <span className="font-medium">{role.charAt(0).toUpperCase() + role.slice(1)}s</span>
                      </div>
                    </td>
                    <td className={`font-semibold text-${color}-600`}>{count}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-${color}-500 h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge active">Active</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td className="font-semibold">Total Active Users</td>
                <td className="font-bold text-blue-600">
                  {Object.values(userStats).reduce((a, b) => a + b, 0)}
                </td>
                <td className="font-semibold">100%</td>
                <td>
                  <span className="status-badge active">System Active</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="chart-row">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activities</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Activity</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <tr key={activity.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'property' ? 'bg-blue-100' :
                            activity.type === 'user' ? 'bg-green-100' :
                            activity.type === 'inquiry' ? 'bg-yellow-100' :
                            'bg-purple-100'
                          }`}>
                            <Icon size={16} className={`${
                              activity.type === 'property' ? 'text-blue-600' :
                              activity.type === 'user' ? 'text-green-600' :
                              activity.type === 'inquiry' ? 'text-yellow-600' :
                              'text-purple-600'
                            }`} />
                          </div>
                          <span className="font-medium capitalize">{activity.type}</span>
                        </div>
                      </td>
                      <td className="text-gray-900">{activity.message}</td>
                      <td className="text-gray-500 text-sm">{activity.time}</td>
                      <td>
                        <span className={`status-badge ${
                          activity.type === 'property' ? 'active' :
                          activity.type === 'user' ? 'pending' :
                          activity.type === 'inquiry' ? 'warning' :
                          'completed'
                        }`}>
                          {activity.type === 'property' ? 'Listed' :
                           activity.type === 'user' ? 'Registered' :
                           activity.type === 'inquiry' ? 'Received' :
                           'Completed'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Properties */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Performing Properties</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Property</th>
                  <th>Price</th>
                  <th>Views</th>
                  <th>Inquiries</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {topProperties.map((property, index) => (
                  <tr key={property.id}>
                    <td>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        'bg-orange-400'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 bg-blue-100 rounded flex items-center justify-center">
                          <Building2 size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{property.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-green-600">{property.price}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Eye size={14} className="text-blue-500" />
                        <span className="font-medium">{property.views.toLocaleString()}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={14} className="text-orange-500" />
                        <span className="font-medium">{property.inquiries}</span>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <span className={`status-badge ${
                          index === 0 ? 'active' :
                          index === 1 ? 'pending' :
                          'warning'
                        }`}>
                          {index === 0 ? 'Hot' : index === 1 ? 'Popular' : 'Trending'}
                        </span>
                        <div className="text-xs text-gray-500">
                          {((property.inquiries / property.views) * 100).toFixed(1)}% conversion
                        </div>
                      </div>
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

export default Dashboard;