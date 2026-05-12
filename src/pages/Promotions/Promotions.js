import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Power,
  Calendar,
  Users,
  Percent,
  DollarSign
} from 'lucide-react';
import { PROMOTION_STATUS, DISCOUNT_TYPES, USER_SEGMENTS } from '../../constants';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const Promotions = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    userSegment: '',
    discountType: '',
    dateRange: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const data = await APIService.getPromotions();
      setPromotions(data);
    } catch (error) {
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusObj = PROMOTION_STATUS.find(s => s.value === status);
    return statusObj ? statusObj.color : '#6b7280';
  };

  const getDiscountTypeLabel = (type) => {
    const typeObj = DISCOUNT_TYPES.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const getUserSegmentLabel = (segment) => {
    const segmentObj = USER_SEGMENTS.find(s => s.value === segment);
    return segmentObj ? segmentObj.label : segment;
  };

  const formatValue = (type, value) => {
    return type === 'percentage' ? `${value}%` : `$${value}`;
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = (promotion.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (promotion.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || promotion.status === filters.status;
    const matchesUserSegment = !filters.userSegment || promotion.eligibleUsers === filters.userSegment;
    const matchesDiscountType = !filters.discountType || promotion.discountType === filters.discountType;

    return matchesSearch && matchesStatus && matchesUserSegment && matchesDiscountType;
  });

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this promotion?')) {
      try {
        await APIService.updatePromotion(id, { status: 'inactive' });
        setPromotions(prev => 
          prev.map(promo => 
            promo.id === id ? { ...promo, status: 'inactive' } : promo
          )
        );
        toast.success('Promotion deactivated');
      } catch (error) {
        toast.error('Failed to deactivate promotion');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await APIService.deletePromotion(id);
        setPromotions(prev => prev.filter(promo => promo.id !== id));
        toast.success('Promotion deleted');
      } catch (error) {
        toast.error('Failed to delete promotion');
      }
    }
  };

  const exportReport = () => {
    // Mock export functionality
    console.log('Exporting promotions report...');
    alert('Report exported successfully!');
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
          <h1>Promotions & Discounts</h1>
          <p>Manage promotional campaigns and discount offers</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-secondary"
            onClick={exportReport}
          >
            <Download size={20} />
            Export Report
          </button>
          <Link to="/promotions/add" className="btn btn-primary">
            <Plus size={20} />
            Create Promotion
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search promotions by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className="btn btn-outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Status</option>
              {PROMOTION_STATUS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>User Segment</label>
            <select
              value={filters.userSegment}
              onChange={(e) => setFilters(prev => ({ ...prev, userSegment: e.target.value }))}
            >
              <option value="">All Segments</option>
              {USER_SEGMENTS.map(segment => (
                <option key={segment.value} value={segment.value}>
                  {segment.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Discount Type</label>
            <select
              value={filters.discountType}
              onChange={(e) => setFilters(prev => ({ ...prev, discountType: e.target.value }))}
            >
              <option value="">All Types</option>
              {DISCOUNT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-outline"
            onClick={() => setFilters({ status: '', userSegment: '', discountType: '', dateRange: '' })}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Promotions Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Promotion ID</th>
              <th>Name</th>
              <th>Discount</th>
              <th>Eligible Users</th>
              <th>Redemptions</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Revenue Impact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotions.map(promotion => (
              <tr key={promotion.id}>
                <td>
                  <span className="font-mono text-sm">{promotion.code || promotion.id}</span>
                </td>
                <td>
                  <div className="cell-content">
                    <span className="font-medium">{promotion.title || promotion.name}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {promotion.type === 'percentage' ? (
                      <Percent size={16} className="text-blue-500" />
                    ) : (
                      <DollarSign size={16} className="text-green-500" />
                    )}
                    <span className="font-medium">
                      {formatValue(promotion.type, promotion.value)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({getDiscountTypeLabel(promotion.type)})
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span>All Users</span>
                  </div>
                </td>
                <td>
                  <div className="redemption-progress">
                    <span className="font-medium">
                      {promotion.usageCount || 0} / {promotion.maxUsage || '∞'}
                    </span>
                    {promotion.maxUsage && (
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${((promotion.usageCount || 0) / promotion.maxUsage) * 100}%` 
                          }}
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <div className="text-sm">
                      <div>{new Date(promotion.startDate).toLocaleDateString()}</div>
                      <div className="text-gray-500">to {new Date(promotion.endDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: `${getStatusColor(promotion.status)}20`,
                      color: getStatusColor(promotion.status),
                      border: `1px solid ${getStatusColor(promotion.status)}40`
                    }}
                  >
                    {PROMOTION_STATUS.find(s => s.value === promotion.status)?.label || promotion.status}
                  </span>
                </td>
                <td>
                  <span className="font-medium text-green-600">
                    ${((promotion.usageCount || 0) * (promotion.value || 0)).toLocaleString()}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => navigate(`/promotions/view/${promotion.id}`)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => navigate(`/promotions/edit/${promotion.id}`)}
                      title="Edit Promotion"
                    >
                      <Edit size={16} />
                    </button>
                    {promotion.status === 'active' && (
                      <button
                        className="btn-icon text-orange-600"
                        onClick={() => handleDeactivate(promotion.id)}
                        title="Deactivate"
                      >
                        <Power size={16} />
                      </button>
                    )}
                    <button
                      className="btn-icon text-red-600"
                      onClick={() => handleDelete(promotion.id)}
                      title="Delete Promotion"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPromotions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Plus size={48} />
            </div>
            <h3>No promotions found</h3>
            <p>
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search or filters'
                : 'Create your first promotion to get started'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f) && (
              <Link to="/promotions/add" className="btn btn-primary">
                <Plus size={20} />
                Create Promotion
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;