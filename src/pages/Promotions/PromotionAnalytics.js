import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  Target,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw
} from 'lucide-react';
import { CHART_COLORS } from '../../constants';

const PromotionAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [selectedPromotion, setSelectedPromotion] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange, selectedPromotion]);

  const loadAnalyticsData = () => {
    setLoading(true);
    
    // Mock analytics data
    setTimeout(() => {
      const mockData = {
        overview: {
          totalPromotions: 12,
          activePromotions: 8,
          totalRedemptions: 1247,
          revenueImpact: 45600,
          averageRedemptionRate: 68.5,
          topPerformingPromotion: 'New User Welcome Discount'
        },
        promotionPerformance: [
          {
            id: 'PROMO001',
            name: 'New User Welcome Discount',
            redemptions: 456,
            revenueImpact: 15000,
            redemptionRate: 85.2,
            status: 'active'
          },
          {
            id: 'PROMO002',
            name: 'Premium Listing 50% Off',
            redemptions: 320,
            revenueImpact: 8500,
            redemptionRate: 64.0,
            status: 'expired'
          },
          {
            id: 'PROMO003',
            name: 'Transaction Fee Waiver',
            redemptions: 245,
            revenueImpact: 12000,
            redemptionRate: 49.0,
            status: 'active'
          },
          {
            id: 'PROMO004',
            name: 'Seasonal Discount',
            redemptions: 226,
            revenueImpact: 10100,
            redemptionRate: 75.3,
            status: 'active'
          }
        ],
        userSegmentBreakdown: [
          { segment: 'New Users', redemptions: 567, percentage: 45.5 },
          { segment: 'Returning Users', redemptions: 423, percentage: 33.9 },
          { segment: 'Churn Users', redemptions: 257, percentage: 20.6 }
        ],
        revenueImpactTrend: [
          { month: 'Jan', revenue: 12000, savings: 8000 },
          { month: 'Feb', revenue: 15000, savings: 10000 },
          { month: 'Mar', revenue: 18500, savings: 12500 },
          { month: 'Apr', revenue: 22000, savings: 15000 },
          { month: 'May', revenue: 19000, savings: 13000 },
          { month: 'Jun', revenue: 25000, savings: 17000 }
        ],
        promoCodeUsage: [
          { code: 'WELCOME20', uses: 156, maxUses: 200 },
          { code: 'NEWUSER2024', uses: 89, maxUses: 150 },
          { code: 'PREMIUM50', uses: 134, maxUses: 150 },
          { code: 'FREEFEE100', uses: 67, maxUses: 100 }
        ]
      };

      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  };

  const exportReport = () => {
    // Mock export functionality
    console.log('Exporting analytics report...');
    alert('Analytics report exported successfully!');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>Promotion Analytics</h1>
          <p>Track performance and analyze promotional campaign effectiveness</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-outline"
            onClick={loadAnalyticsData}
          >
            <RefreshCw size={20} />
            Refresh
          </button>
          <button 
            className="btn btn-secondary"
            onClick={exportReport}
          >
            <Download size={20} />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Promotion</label>
          <select
            value={selectedPromotion}
            onChange={(e) => setSelectedPromotion(e.target.value)}
          >
            <option value="">All Promotions</option>
            {analyticsData?.promotionPerformance.map(promo => (
              <option key={promo.id} value={promo.id}>
                {promo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Target className="text-blue-500" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{analyticsData.overview.totalPromotions}</div>
            <div className="stat-label">Total Promotions</div>
            <div className="stat-change positive">
              <TrendingUp size={16} />
              {analyticsData.overview.activePromotions} active
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users className="text-green-500" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{analyticsData.overview.totalRedemptions.toLocaleString()}</div>
            <div className="stat-label">Total Redemptions</div>
            <div className="stat-change positive">
              <TrendingUp size={16} />
              +12.5% from last period
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign className="text-purple-500" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(analyticsData.overview.revenueImpact)}</div>
            <div className="stat-label">Revenue Impact</div>
            <div className="stat-change positive">
              <TrendingUp size={16} />
              +8.3% from last period
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 className="text-orange-500" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatPercentage(analyticsData.overview.averageRedemptionRate)}</div>
            <div className="stat-label">Avg. Redemption Rate</div>
            <div className="stat-change positive">
              <TrendingUp size={16} />
              +2.1% from last period
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Promotion Performance */}
        <div className="analytics-card">
          <div className="card-header">
            <h3>Promotion Performance</h3>
            <BarChart3 size={20} />
          </div>
          <div className="performance-list">
            {analyticsData.promotionPerformance.map((promo, index) => (
              <div key={promo.id} className="performance-item">
                <div className="performance-rank">#{index + 1}</div>
                <div className="performance-info">
                  <div className="performance-name">{promo.name}</div>
                  <div className="performance-stats">
                    <span>{promo.redemptions} redemptions</span>
                    <span>{formatCurrency(promo.revenueImpact)} impact</span>
                    <span>{formatPercentage(promo.redemptionRate)} rate</span>
                  </div>
                </div>
                <div className="performance-progress">
                  <div 
                    className="progress-bar"
                    style={{ width: `${promo.redemptionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Segment Breakdown */}
        <div className="analytics-card">
          <div className="card-header">
            <h3>User Segment Breakdown</h3>
            <PieChart size={20} />
          </div>
          <div className="segment-breakdown">
            {analyticsData.userSegmentBreakdown.map((segment, index) => (
              <div key={segment.segment} className="segment-item">
                <div className="segment-info">
                  <div 
                    className="segment-color"
                    style={{ backgroundColor: CHART_COLORS[index] }}
                  />
                  <div className="segment-details">
                    <div className="segment-name">{segment.segment}</div>
                    <div className="segment-stats">
                      {segment.redemptions} redemptions ({formatPercentage(segment.percentage)})
                    </div>
                  </div>
                </div>
                <div className="segment-percentage">
                  {formatPercentage(segment.percentage)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Impact Trend */}
        <div className="analytics-card full-width">
          <div className="card-header">
            <h3>Revenue Impact Trend</h3>
            <TrendingUp size={20} />
          </div>
          <div className="trend-chart">
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#3b82f6' }} />
                <span>Revenue Generated</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#10b981' }} />
                <span>Customer Savings</span>
              </div>
            </div>
            <div className="chart-bars">
              {analyticsData.revenueImpactTrend.map((data, index) => {
                const maxValue = Math.max(...analyticsData.revenueImpactTrend.map(d => Math.max(d.revenue, d.savings)));
                return (
                  <div key={data.month} className="chart-bar-group">
                    <div className="chart-bars-container">
                      <div 
                        className="chart-bar revenue"
                        style={{ 
                          height: `${(data.revenue / maxValue) * 200}px`,
                          backgroundColor: '#3b82f6'
                        }}
                        title={`Revenue: ${formatCurrency(data.revenue)}`}
                      />
                      <div 
                        className="chart-bar savings"
                        style={{ 
                          height: `${(data.savings / maxValue) * 200}px`,
                          backgroundColor: '#10b981'
                        }}
                        title={`Savings: ${formatCurrency(data.savings)}`}
                      />
                    </div>
                    <div className="chart-label">{data.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Promo Code Usage */}
        <div className="analytics-card">
          <div className="card-header">
            <h3>Promo Code Usage</h3>
            <Target size={20} />
          </div>
          <div className="promo-code-usage">
            {analyticsData.promoCodeUsage.map(code => (
              <div key={code.code} className="usage-item">
                <div className="usage-info">
                  <div className="code-name">{code.code}</div>
                  <div className="usage-stats">
                    {code.uses} / {code.maxUses} uses
                  </div>
                </div>
                <div className="usage-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(code.uses / code.maxUses) * 100}%` }}
                    />
                  </div>
                  <span className="usage-percentage">
                    {formatPercentage((code.uses / code.maxUses) * 100)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="analytics-card">
          <div className="card-header">
            <h3>Key Insights</h3>
            <TrendingUp size={20} />
          </div>
          <div className="insights-list">
            <div className="insight-item">
              <div className="insight-icon positive">
                <TrendingUp size={16} />
              </div>
              <div className="insight-text">
                <strong>Top Performer:</strong> {analyticsData.overview.topPerformingPromotion} has the highest redemption rate at 85.2%
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon positive">
                <Users size={16} />
              </div>
              <div className="insight-text">
                <strong>User Engagement:</strong> New users account for 45.5% of all redemptions, showing strong acquisition impact
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon neutral">
                <Calendar size={16} />
              </div>
              <div className="insight-text">
                <strong>Seasonal Trend:</strong> Promotion usage peaks in April and June, suggesting seasonal buying patterns
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon positive">
                <DollarSign size={16} />
              </div>
              <div className="insight-text">
                <strong>ROI Impact:</strong> Every $1 in discounts generates $2.70 in additional revenue
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionAnalytics;