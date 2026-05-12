import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react';
import { DISCOUNT_TYPES, USER_SEGMENTS, PROMOTION_SERVICES, PROMOTION_STATUS } from '../../constants';
import toast from 'react-hot-toast';

const PromotionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    applicableServices: [],
    eligibleUsers: 'all',
    redemptionLimit: '',
    startDate: '',
    endDate: '',
    status: 'active',
    stackable: false,
    perUserLimit: 1,
    geographicRestrictions: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      // Mock loading existing promotion data
      setLoading(true);
      setTimeout(() => {
        const mockPromotion = {
          id: 'PROMO001',
          name: 'New User Welcome Discount',
          description: 'Special discount for new users joining our platform',
          discountType: 'percentage',
          discountValue: 20,
          applicableServices: ['subscription_plans', 'listing_upgrades'],
          eligibleUsers: 'new',
          redemptionLimit: 100,
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          status: 'active',
          stackable: false,
          perUserLimit: 1,
          geographicRestrictions: ''
        };
        setFormData(mockPromotion);
        setLoading(false);
      }, 1000);
    }
  }, [isEdit, id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceChange = (serviceValue) => {
    setFormData(prev => ({
      ...prev,
      applicableServices: prev.applicableServices.includes(serviceValue)
        ? prev.applicableServices.filter(s => s !== serviceValue)
        : [...prev.applicableServices, serviceValue]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Promotion name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Promotion name must be at least 3 characters';
    }

    if (!formData.discountValue) {
      newErrors.discountValue = 'Discount value is required';
    } else {
      const value = parseFloat(formData.discountValue);
      if (isNaN(value) || value <= 0) {
        newErrors.discountValue = 'Discount value must be a positive number';
      } else if (formData.discountType === 'percentage' && value > 100) {
        newErrors.discountValue = 'Percentage discount cannot exceed 100%';
      }
    }

    if (formData.applicableServices.length === 0) {
      newErrors.applicableServices = 'At least one service must be selected';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!isEdit && startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }

      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.redemptionLimit && (isNaN(formData.redemptionLimit) || parseInt(formData.redemptionLimit) <= 0)) {
      newErrors.redemptionLimit = 'Redemption limit must be a positive integer';
    }

    if (formData.perUserLimit && (isNaN(formData.perUserLimit) || parseInt(formData.perUserLimit) <= 0)) {
      newErrors.perUserLimit = 'Per-user limit must be a positive integer';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(isEdit ? 'Promotion updated successfully!' : 'Promotion created successfully!');
      navigate('/promotions');
    } catch (error) {
      toast.error('Failed to save promotion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/promotions');
    }
  };

  if (loading && isEdit) {
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
          <button 
            className="btn-back"
            onClick={() => navigate('/promotions')}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>{isEdit ? 'Edit Promotion' : 'Create New Promotion'}</h1>
            <p>{isEdit ? 'Update promotion details' : 'Set up a new promotional campaign'}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">
                Promotion Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter promotion name"
              />
              {errors.name && (
                <span className="error-message">
                  <AlertCircle size={16} />
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={errors.description ? 'error' : ''}
                placeholder="Enter promotion description (optional)"
                rows={3}
              />
              <div className="char-count">
                {formData.description.length}/500 characters
              </div>
              {errors.description && (
                <span className="error-message">
                  <AlertCircle size={16} />
                  {errors.description}
                </span>
              )}
            </div>
          </div>

          {/* Discount Configuration */}
          <div className="form-section">
            <h3>Discount Configuration</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="discountType">
                  Discount Type <span className="required">*</span>
                </label>
                <select
                  id="discountType"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                >
                  {DISCOUNT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="discountValue">
                  Discount Value <span className="required">*</span>
                </label>
                <div className="input-with-addon">
                  <input
                    type="number"
                    id="discountValue"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    className={errors.discountValue ? 'error' : ''}
                    placeholder="Enter value"
                    min="0"
                    step={formData.discountType === 'percentage' ? '0.01' : '1'}
                  />
                  <span className="input-addon">
                    {formData.discountType === 'percentage' ? '%' : '$'}
                  </span>
                </div>
                {errors.discountValue && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.discountValue}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Applicable Services */}
          <div className="form-section">
            <h3>Applicable Services <span className="required">*</span></h3>
            <div className="checkbox-group">
              {PROMOTION_SERVICES.map(service => (
                <label key={service.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.applicableServices.includes(service.value)}
                    onChange={() => handleServiceChange(service.value)}
                  />
                  <span className="checkbox-text">{service.label}</span>
                </label>
              ))}
            </div>
            {errors.applicableServices && (
              <span className="error-message">
                <AlertCircle size={16} />
                {errors.applicableServices}
              </span>
            )}
          </div>

          {/* Eligibility Rules */}
          <div className="form-section">
            <h3>Eligibility Rules</h3>
            
            <div className="form-group">
              <label htmlFor="eligibleUsers">Eligible Users</label>
              <select
                id="eligibleUsers"
                name="eligibleUsers"
                value={formData.eligibleUsers}
                onChange={handleInputChange}
              >
                {USER_SEGMENTS.map(segment => (
                  <option key={segment.value} value={segment.value}>
                    {segment.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="redemptionLimit">Total Redemption Limit</label>
                <input
                  type="number"
                  id="redemptionLimit"
                  name="redemptionLimit"
                  value={formData.redemptionLimit}
                  onChange={handleInputChange}
                  className={errors.redemptionLimit ? 'error' : ''}
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
                {errors.redemptionLimit && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.redemptionLimit}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="perUserLimit">Per-User Limit</label>
                <input
                  type="number"
                  id="perUserLimit"
                  name="perUserLimit"
                  value={formData.perUserLimit}
                  onChange={handleInputChange}
                  className={errors.perUserLimit ? 'error' : ''}
                  placeholder="1"
                  min="1"
                />
                {errors.perUserLimit && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.perUserLimit}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="geographicRestrictions">Geographic Restrictions</label>
              <input
                type="text"
                id="geographicRestrictions"
                name="geographicRestrictions"
                value={formData.geographicRestrictions}
                onChange={handleInputChange}
                placeholder="e.g., US, CA, UK (leave empty for global)"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="form-section">
            <h3>Schedule</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">
                  Start Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={errors.startDate ? 'error' : ''}
                />
                {errors.startDate && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.startDate}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="endDate">
                  End Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={errors.endDate ? 'error' : ''}
                />
                {errors.endDate && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.endDate}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="form-section">
            <h3>Advanced Settings</h3>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                {PROMOTION_STATUS.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="stackable"
                  checked={formData.stackable}
                  onChange={handleInputChange}
                />
                <span className="checkbox-text">
                  Allow stacking with other promotions
                </span>
              </label>
              <p className="form-help">
                When enabled, users can apply multiple promotions together
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            <X size={20} />
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-sm" />
            ) : (
              <Save size={20} />
            )}
            {loading ? 'Saving...' : (isEdit ? 'Update Promotion' : 'Create Promotion')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionForm;