import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Copy, 
  Edit, 
  Trash2, 
  Power, 
  Calendar,
  Hash,
  Target,
  TrendingUp,
  AlertCircle,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const PromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    promotion: '',
    expiry: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCode, setEditingCode] = useState(null);

  // Mock data
  useEffect(() => {
    const mockPromotions = [
      { id: 'PROMO001', name: 'New User Welcome Discount' },
      { id: 'PROMO002', name: 'Premium Listing 50% Off' },
      { id: 'PROMO003', name: 'Transaction Fee Waiver' }
    ];

    const mockPromoCodes = [
      {
        id: 1,
        code: 'WELCOME20',
        linkedPromotion: 'PROMO001',
        promotionName: 'New User Welcome Discount',
        usageCount: 25,
        maxUsage: 50,
        expiryDate: '2024-03-31',
        status: 'active',
        createdAt: '2024-01-01'
      },
      {
        id: 2,
        code: 'NEWUSER2024',
        linkedPromotion: 'PROMO001',
        promotionName: 'New User Welcome Discount',
        usageCount: 20,
        maxUsage: 50,
        expiryDate: '2024-03-31',
        status: 'active',
        createdAt: '2024-01-15'
      },
      {
        id: 3,
        code: 'PREMIUM50',
        linkedPromotion: 'PROMO002',
        promotionName: 'Premium Listing 50% Off',
        usageCount: 32,
        maxUsage: 50,
        expiryDate: '2024-02-29',
        status: 'expired',
        createdAt: '2024-02-01'
      },
      {
        id: 4,
        code: 'FREEFEE100',
        linkedPromotion: 'PROMO003',
        promotionName: 'Transaction Fee Waiver',
        usageCount: 0,
        maxUsage: 100,
        expiryDate: '2024-04-30',
        status: 'active',
        createdAt: '2024-03-01'
      }
    ];

    setTimeout(() => {
      setPromotions(mockPromotions);
      setPromoCodes(mockPromoCodes);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPromoCodes = promoCodes.filter(code => {
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         code.promotionName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || code.status === filters.status;
    const matchesPromotion = !filters.promotion || code.linkedPromotion === filters.promotion;
    
    let matchesExpiry = true;
    if (filters.expiry) {
      const today = new Date();
      const expiryDate = new Date(code.expiryDate);
      
      if (filters.expiry === 'expired') {
        matchesExpiry = expiryDate < today;
      } else if (filters.expiry === 'expiring_soon') {
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        matchesExpiry = expiryDate <= weekFromNow && expiryDate >= today;
      } else if (filters.expiry === 'active') {
        matchesExpiry = expiryDate >= today;
      }
    }

    return matchesSearch && matchesStatus && matchesPromotion && matchesExpiry;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      case 'expired': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Promo code copied to clipboard');
  };

  const handleDeactivate = (id) => {
    if (window.confirm('Are you sure you want to deactivate this promo code?')) {
      setPromoCodes(prev => 
        prev.map(code => 
          code.id === id ? { ...code, status: 'inactive' } : code
        )
      );
      toast.success('Promo code deactivated');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      setPromoCodes(prev => prev.filter(code => code.id !== id));
      toast.success('Promo code deleted');
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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
          <h1>Promo Codes</h1>
          <p>Manage promotional codes for campaigns and partners</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Add Promo Code
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search promo codes..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Promotion</label>
            <select
              value={filters.promotion}
              onChange={(e) => setFilters(prev => ({ ...prev, promotion: e.target.value }))}
            >
              <option value="">All Promotions</option>
              {promotions.map(promo => (
                <option key={promo.id} value={promo.id}>
                  {promo.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Expiry</label>
            <select
              value={filters.expiry}
              onChange={(e) => setFilters(prev => ({ ...prev, expiry: e.target.value }))}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <button 
            className="btn btn-outline"
            onClick={() => setFilters({ status: '', promotion: '', expiry: '' })}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Promo Codes Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Promo Code</th>
              <th>Linked Promotion</th>
              <th>Usage</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromoCodes.map(code => (
              <tr key={code.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-gray-400" />
                    <span className="font-mono font-medium">{code.code}</span>
                    <button
                      className="btn-icon-sm"
                      onClick={() => copyPromoCode(code.code)}
                      title="Copy Code"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    <span className="font-medium">{code.promotionName}</span>
                    <span className="text-sm text-gray-500">{code.linkedPromotion}</span>
                  </div>
                </td>
                <td>
                  <div className="usage-info">
                    <span className="font-medium">
                      {code.usageCount} / {code.maxUsage}
                    </span>
                    <div className="progress-bar-sm">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${(code.usageCount / code.maxUsage) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{new Date(code.expiryDate).toLocaleDateString()}</span>
                    {new Date(code.expiryDate) < new Date() && (
                      <AlertCircle size={16} className="text-red-500" />
                    )}
                  </div>
                </td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: `${getStatusColor(code.status)}20`,
                      color: getStatusColor(code.status),
                      border: `1px solid ${getStatusColor(code.status)}40`
                    }}
                  >
                    {code.status}
                  </span>
                </td>
                <td>
                  <span className="text-sm text-gray-600">
                    {new Date(code.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => setEditingCode(code)}
                      title="Edit Code"
                    >
                      <Edit size={16} />
                    </button>
                    {code.status === 'active' && (
                      <button
                        className="btn-icon text-orange-600"
                        onClick={() => handleDeactivate(code.id)}
                        title="Deactivate"
                      >
                        <Power size={16} />
                      </button>
                    )}
                    <button
                      className="btn-icon text-red-600"
                      onClick={() => handleDelete(code.id)}
                      title="Delete Code"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPromoCodes.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Hash size={48} />
            </div>
            <h3>No promo codes found</h3>
            <p>
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search or filters'
                : 'Create your first promo code to get started'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f) && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={20} />
                Add Promo Code
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingCode) && (
        <PromoCodeModal
          code={editingCode}
          promotions={promotions}
          onClose={() => {
            setShowAddModal(false);
            setEditingCode(null);
          }}
          onSave={(codeData) => {
            if (editingCode) {
              setPromoCodes(prev => 
                prev.map(code => 
                  code.id === editingCode.id ? { ...code, ...codeData } : code
                )
              );
              toast.success('Promo code updated successfully');
            } else {
              const newCode = {
                id: Date.now(),
                ...codeData,
                usageCount: 0,
                createdAt: new Date().toISOString().split('T')[0]
              };
              setPromoCodes(prev => [...prev, newCode]);
              toast.success('Promo code created successfully');
            }
            setShowAddModal(false);
            setEditingCode(null);
          }}
          generateRandomCode={generateRandomCode}
        />
      )}
    </div>
  );
};

// Promo Code Modal Component
const PromoCodeModal = ({ code, promotions, onClose, onSave, generateRandomCode }) => {
  const [formData, setFormData] = useState({
    code: code?.code || '',
    linkedPromotion: code?.linkedPromotion || '',
    maxUsage: code?.maxUsage || '',
    expiryDate: code?.expiryDate || '',
    status: code?.status || 'active'
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Promo code is required';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Promo code must be at least 3 characters';
    }

    if (!formData.linkedPromotion) {
      newErrors.linkedPromotion = 'Please select a promotion';
    }

    if (!formData.maxUsage || formData.maxUsage <= 0) {
      newErrors.maxUsage = 'Max usage must be greater than 0';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (new Date(formData.expiryDate) <= new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const promotion = promotions.find(p => p.id === formData.linkedPromotion);
      onSave({
        ...formData,
        promotionName: promotion?.name || ''
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{code ? 'Edit Promo Code' : 'Add New Promo Code'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="code">
              Promo Code <span className="required">*</span>
            </label>
            <div className="input-with-button">
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className={errors.code ? 'error' : ''}
                placeholder="Enter promo code"
              />
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setFormData(prev => ({ ...prev, code: generateRandomCode() }))}
              >
                Generate
              </button>
            </div>
            {errors.code && (
              <span className="error-message">
                <AlertCircle size={16} />
                {errors.code}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="linkedPromotion">
              Linked Promotion <span className="required">*</span>
            </label>
            <select
              id="linkedPromotion"
              name="linkedPromotion"
              value={formData.linkedPromotion}
              onChange={handleInputChange}
              className={errors.linkedPromotion ? 'error' : ''}
            >
              <option value="">Select a promotion</option>
              {promotions.map(promo => (
                <option key={promo.id} value={promo.id}>
                  {promo.name}
                </option>
              ))}
            </select>
            {errors.linkedPromotion && (
              <span className="error-message">
                <AlertCircle size={16} />
                {errors.linkedPromotion}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="maxUsage">
              Max Usage <span className="required">*</span>
            </label>
            <input
              type="number"
              id="maxUsage"
              name="maxUsage"
              value={formData.maxUsage}
              onChange={handleInputChange}
              className={errors.maxUsage ? 'error' : ''}
              placeholder="Enter maximum usage count"
              min="1"
            />
            {errors.maxUsage && (
              <span className="error-message">
                <AlertCircle size={16} />
                {errors.maxUsage}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">
              Expiry Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className={errors.expiryDate ? 'error' : ''}
            />
            {errors.expiryDate && (
              <span className="error-message">
                <AlertCircle size={16} />
                {errors.expiryDate}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={20} />
              {code ? 'Update Code' : 'Create Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoCodes;