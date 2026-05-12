import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Power, 
  Trash2, 
  Calendar, 
  Users, 
  Target, 
  TrendingUp,
  DollarSign,
  Percent,
  MapPin,
  Settings,
  Copy,
  Eye
} from 'lucide-react';
import { PROMOTION_STATUS, DISCOUNT_TYPES, USER_SEGMENTS, PROMOTION_SERVICES } from '../../constants';
import toast from 'react-hot-toast';

const PromotionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoCodes, setPromoCodes] = useState([]);

  useEffect(() => {
    // Mock loading promotion data
    setTimeout(() => {
      const mockPromotion = {
        id: 'PROMO001',
        name: 'New User Welcome Discount',
        description: 'Special discount for new users joining our platform to encourage sign-ups and first purchases.',
        discountType: 'percentage',
        discountValue: 20,
        applicableServices: ['subscription_plans', 'listing_upgrades'],
        eligibleUsers: 'new',
        redemptionLimit: 100,
        redemptionsUsed: 45,
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        status: 'active',
        stackable: false,
        perUserLimit: 1,
        geographicRestrictions: 'US, CA, UK',
        revenueImpact: 15000,
        createdAt: '2023-12-15',
        createdBy: 'Admin User',
        lastModified: '2024-01-15'
      };

      const mockPromoCodes = [
        {
          id: 1,
          code: 'WELCOME20',
          usageCount: 25,
          maxUsage: 50,
          expiryDate: '2024-03-31',
          status: 'active'
        },
        {
          id: 2,
          code: 'NEWUSER2024',
          usageCount: 20,
          maxUsage: 50,
          expiryDate: '2024-03-31',
          status: 'active'
        }
      ];

      setPromotion(mockPromotion);
      setPromoCodes(mockPromoCodes);
      setLoading(false);
    }, 1000);
  }, [id]);

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

  const getServiceLabel = (serviceValue) => {
    const service = PROMOTION_SERVICES.find(s => s.value === serviceValue);
    return service ? service.label : serviceValue;
  };

  const formatValue = (type, value) => {
    return type === 'percentage' ? `${value}%` : `$${value}`;
  };

  const handleDeactivate = () => {
    if (window.confirm('Are you sure you want to deactivate this promotion?')) {
      setPromotion(prev => ({ ...prev, status: 'inactive' }));
      toast.success('Promotion deactivated successfully');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this promotion? This action cannot be undone.')) {
      toast.success('Promotion deleted successfully');
      navigate('/promotions');
    }
  };

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Promo code copied to clipboard');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Promotion not found</h3>
          <p>The promotion you're looking for doesn't exist or has been deleted.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/promotions')}
          >
            Back to Promotions
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = promotion.redemptionLimit 
    ? (promotion.redemptionsUsed / promotion.redemptionLimit) * 100 
    : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <button 
            className="btn-back"
            onClick={() => navigate('/promotions')}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>{promotion.name}</h1>
            <p>Promotion ID: {promotion.id}</p>
          </div>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate(`/promotions/edit/${promotion.id}`)}
          >
            <Edit size={20} />
            Edit
          </button>
          {promotion.status === 'active' && (
            <button
              className="btn btn-secondary"
              onClick={handleDeactivate}
            >
              <Power size={20} />
              Deactivate
            </button>
          )}
          <button
            className="btn btn-danger"
            onClick={handleDelete}
          >
            <Trash2 size={20} />
            Delete
          </button>
        </div>
      </div>

      <div className="detail-container">
        {/* Status and Overview */}
        <div className="detail-section">
          <div className="section-header">
            <h3>Overview</h3>
            <span 
              className="status-badge large"
              style={{ 
                backgroundColor: `${getStatusColor(promotion.status)}20`,
                color: getStatusColor(promotion.status),
                border: `1px solid ${getStatusColor(promotion.status)}40`
              }}
            >
              {PROMOTION_STATUS.find(s => s.value === promotion.status)?.label || promotion.status}
            </span>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Description</div>
              <div className="info-value">{promotion.description || 'No description provided'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Created</div>
              <div className="info-value">
                {new Date(promotion.createdAt).toLocaleDateString()} by {promotion.createdBy}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Last Modified</div>
              <div className="info-value">{new Date(promotion.lastModified).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Discount Configuration */}
        <div className="detail-section">
          <div className="section-header">
            <h3>Discount Configuration</h3>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">
                <div className="flex items-center gap-2">
                  {promotion.discountType === 'percentage' ? (
                    <Percent size={16} className="text-blue-500" />
                  ) : (
                    <DollarSign size={16} className="text-green-500" />
                  )}
                  Discount Type
                </div>
              </div>
              <div className="info-value">{getDiscountTypeLabel(promotion.discountType)}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Discount Value</div>
              <div className="info-value font-bold text-lg">
                {formatValue(promotion.discountType, promotion.discountValue)}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Stackable</div>
              <div className="info-value">
                <span className={`badge ${promotion.stackable ? 'badge-success' : 'badge-secondary'}`}>
                  {promotion.stackable ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Applicable Services */}
        <div className="detail-section">
          <div className="section-header">
            <h3>
              <Target size={20} />
              Applicable Services
            </h3>
          </div>
          
          <div className="service-tags">
            {promotion.applicableServices.map(service => (
              <span key={service} className="service-tag">
                {getServiceLabel(service)}
              </span>
            ))}
          </div>
        </div>

        {/* Eligibility Rules */}
        <div className="detail-section">
          <div className="section-header">
            <h3>
              <Users size={20} />
              Eligibility Rules
            </h3>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Eligible Users</div>
              <div className="info-value">{getUserSegmentLabel(promotion.eligibleUsers)}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Per-User Limit</div>
              <div className="info-value">{promotion.perUserLimit} redemption(s)</div>
            </div>
            <div className="info-item">
              <div className="info-label">
                <MapPin size={16} />
                Geographic Restrictions
              </div>
              <div className="info-value">
                {promotion.geographicRestrictions || 'Global (No restrictions)'}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="detail-section">
          <div className="section-header">
            <h3>
              <Calendar size={20} />
              Schedule
            </h3>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Start Date</div>
              <div className="info-value">{new Date(promotion.startDate).toLocaleDateString()}</div>
            </div>
            <div className="info-item">
              <div className="info-label">End Date</div>
              <div className="info-value">{new Date(promotion.endDate).toLocaleDateString()}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Duration</div>
              <div className="info-value">
                {Math.ceil((new Date(promotion.endDate) - new Date(promotion.startDate)) / (1000 * 60 * 60 * 24))} days
              </div>
            </div>
          </div>
        </div>

        {/* Redemption Statistics */}
        <div className="detail-section">
          <div className="section-header">
            <h3>
              <TrendingUp size={20} />
              Redemption Statistics
            </h3>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{promotion.redemptionsUsed}</div>
              <div className="stat-label">Total Redemptions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {promotion.redemptionLimit ? promotion.redemptionLimit - promotion.redemptionsUsed : '∞'}
              </div>
              <div className="stat-label">Remaining</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">${promotion.revenueImpact.toLocaleString()}</div>
              <div className="stat-label">Revenue Impact</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {promotion.redemptionLimit ? `${progressPercentage.toFixed(1)}%` : 'N/A'}
              </div>
              <div className="stat-label">Usage Rate</div>
            </div>
          </div>

          {promotion.redemptionLimit && (
            <div className="progress-section">
              <div className="progress-header">
                <span>Redemption Progress</span>
                <span>{promotion.redemptionsUsed} / {promotion.redemptionLimit}</span>
              </div>
              <div className="progress-bar large">
                <div 
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Promo Codes */}
        {promoCodes.length > 0 && (
          <div className="detail-section">
            <div className="section-header">
              <h3>
                <Settings size={20} />
                Associated Promo Codes
              </h3>
            </div>
            
            <div className="promo-codes-list">
              {promoCodes.map(code => (
                <div key={code.id} className="promo-code-item">
                  <div className="promo-code-info">
                    <div className="promo-code-text">
                      <span className="code-value">{code.code}</span>
                      <span className="code-usage">
                        {code.usageCount} / {code.maxUsage} uses
                      </span>
                    </div>
                    <div className="promo-code-meta">
                      <span>Expires: {new Date(code.expiryDate).toLocaleDateString()}</span>
                      <span className={`status-dot ${code.status}`}>{code.status}</span>
                    </div>
                  </div>
                  <div className="promo-code-actions">
                    <button
                      className="btn-icon"
                      onClick={() => copyPromoCode(code.code)}
                      title="Copy Code"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionDetail;