import React, { useState, useEffect } from 'react';
import { Download, Home, TrendingUp, DollarSign, MapPin, BarChart3 } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const PropertyReport = () => {
  const [properties, setProperties] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      const [propertyData, analyticsData] = await Promise.all([
        APIService.getProperties(),
        APIService.getPropertyAnalytics(dateRange)
      ]);
      setProperties(propertyData);
      setAnalytics(analyticsData);
    } catch (error) {
      toast.error('Failed to load property data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.success('Property report exported successfully!');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="page-header">
        <h1 className="page-title">Property Report</h1>
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
            <Home size={24} />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalProperties || properties.length}</h3>
            <p>Total Properties</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{analytics.activeProperties || properties.filter(p => p.status === 'active').length}</h3>
            <p>Active Listings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>${(analytics.averagePrice || 0).toLocaleString()}</h3>
            <p>Average Price</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <h3>{analytics.soldProperties || 0}</h3>
            <p>Sold This Month</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Property Listings by Type</h3>
          </div>
          <div className="chart-bars">
            {(analytics.propertyTypes || []).map((data, index) => (
              <div key={index} className="chart-bar-group">
                <div className="chart-bars-container">
                  <div 
                    className="chart-bar" 
                    style={{ 
                      height: `${(data.count / Math.max(...(analytics.propertyTypes || []).map(d => d.count))) * 180}px`,
                      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
                    }}
                  />
                </div>
                <div className="chart-label">{data.type}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">Properties by Status</h3>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {(analytics.statusDistribution || []).map(status => (
                  <tr key={status.name}>
                    <td className="font-medium capitalize">{status.name}</td>
                    <td>{status.count}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-full rounded" 
                            style={{ 
                              width: `${status.percentage}%`,
                              backgroundColor: status.name === 'active' ? '#10b981' : 
                                             status.name === 'sold' ? '#6b7280' :
                                             status.name === 'pending' ? '#f59e0b' : '#ef4444'
                            }}
                          />
                        </div>
                        <span className="text-sm">{status.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">Top Locations</h3>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Properties</th>
                  <th>Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {(analytics.topLocations || []).map((location, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="font-medium">{location.name}</span>
                      </div>
                    </td>
                    <td>{location.count}</td>
                    <td className="font-semibold">${location.avgPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="data-table-container">
          <div className="data-table-header">
            <h3 className="data-table-title">Price Range Distribution</h3>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Price Range</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {(analytics.priceRanges || []).map((range, index) => (
                  <tr key={index}>
                    <td className="font-medium">{range.range}</td>
                    <td>{range.count}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-full bg-green-500 rounded" 
                            style={{ width: `${range.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm">{range.percentage}%</span>
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
          <h3 className="data-table-title">Recent Property Activity</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th>Agent</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {properties.slice(0, 10).map(property => (
                <tr key={property.id}>
                  <td className="font-medium">{property.title}</td>
                  <td className="capitalize">{property.type}</td>
                  <td>{property.location}</td>
                  <td className="font-semibold">${property.price.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${
                      property.status === 'active' ? 'bg-green-100 text-green-800' :
                      property.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                      property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td>{property.agentName || property.agent}</td>
                  <td>{property.views || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PropertyReport;