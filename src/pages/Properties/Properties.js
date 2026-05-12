import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin,
  Calendar,
  DollarSign,
  Check,
  X
} from 'lucide-react';
import { PROPERTY_TYPES, PROPERTY_CATEGORIES, PROPERTY_STATUS, REJECTION_REASONS } from '../../constants';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const Properties = () => {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [agents, setAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Handle filter from dashboard navigation and URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');
    
    console.log('URL params:', statusParam);
    
    if (statusParam) {
      setStatusFilter(statusParam);
      console.log('Setting status filter to:', statusParam);
    } else if (location.state?.filter?.status) {
      setStatusFilter(location.state.filter.status);
    } else {
      setStatusFilter('all');
    }
  }, [location.search, location.state]);

  // Load properties and agents from API
  useEffect(() => {
    loadProperties();
    loadAgents();
  }, []);

  const loadProperties = async () => {
    try {
      const propertyData = await APIService.getProperties();
      setProperties(propertyData);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const loadAgents = async () => {
    try {
      const userData = await APIService.getUsers();
      const agentData = userData.filter(user => user.role === 'agent');
      setAgents(agentData);
    } catch (error) {
      console.error('Failed to load agents');
    }
  };

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchTerm === '' || 
                         (property.title && property.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (property.location && property.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (property.description && property.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesType = typeFilter === 'all' || property.listingType === typeFilter;
    const matchesCategory = categoryFilter === 'all' || property.category === categoryFilter;
    const matchesAgent = agentFilter === 'all' || property.agentId === parseInt(agentFilter);
    
    return matchesSearch && matchesStatus && matchesType && matchesCategory && matchesAgent;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await APIService.deleteProperty(id);
        setProperties(properties.filter(p => p.id !== id));
        toast.success('Property deleted successfully');
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await APIService.approveProperty(id);
      loadProperties(); // Reload to get updated data
      toast.success('✅ Property approved and is now visible to users!');
    } catch (error) {
      toast.error('Failed to approve property');
    }
  };

  const handleReject = (property) => {
    setSelectedProperty(property);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason) {
      toast.error('Please select a reason for rejection');
      return;
    }
    if (rejectionReason === 'other' && !rejectionNotes.trim()) {
      toast.error('Please provide additional notes for rejection');
      return;
    }

    try {
      const reason = rejectionReason === 'other' ? rejectionNotes : REJECTION_REASONS.find(r => r.value === rejectionReason)?.label;
      await APIService.rejectProperty(selectedProperty.id, reason);
      loadProperties();
      toast.success('❌ Property rejected successfully!');
      setShowRejectModal(false);
      setRejectionReason('');
      setRejectionNotes('');
      setSelectedProperty(null);
    } catch (error) {
      toast.error('Failed to reject property');
    }
  };

  const handleFeature = async (id) => {
    try {
      await APIService.updateProperty(id, { status: 'featured', featured: true });
      loadProperties();
      toast.success('⭐ Property featured successfully!');
    } catch (error) {
      toast.error('Failed to feature property');
    }
  };

  const handleUnfeature = async (id) => {
    try {
      await APIService.updateProperty(id, { status: 'active', featured: false });
      loadProperties();
      toast.success('✅ Property removed from featured!');
    } catch (error) {
      toast.error('Failed to remove from featured');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = PROPERTY_STATUS.find(s => s.value === status);
    return (
      <span 
        className="status-badge"
        style={{ 
          backgroundColor: `${statusConfig?.color}20`,
          color: statusConfig?.color 
        }}
      >
        {statusConfig?.label || status}
      </span>
    );
  };

  const formatPrice = (price, type) => {
    if (type === 'studio' && price < 10000) {
      return `$${price.toLocaleString()}/month`;
    }
    return `$${price.toLocaleString()}`;
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
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          {statusFilter === 'pending_approval' ? 'Pending Approval Properties' :
           statusFilter === 'featured' ? 'Featured Properties' :
           statusFilter === 'active' ? 'Active Properties' :
           statusFilter === 'rejected' ? 'Rejected Properties' :
           'Properties'}
        </h1>
        <div className="page-actions">
          <Link to="/admin/properties/add" className="btn btn-primary">
            <Plus size={16} />
            Add Property
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="filters-container">
          <div className="search-container">
            <div className="relative">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filters-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              {PROPERTY_STATUS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {PROPERTY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            {/* Property Status Counts */}
            <div className="flex items-center gap-3 ml-4">
              <div className="flex items-center bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <Check size={16} className="text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  {properties.filter(p => p.status === 'active').length} Approved
                </span>
              </div>
              <div className="flex items-center bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                <Filter size={16} className="text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-800">
                  {properties.filter(p => p.status === 'pending_approval').length} Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProperties.map(property => (
          <div key={property.id} className="property-card">
            {/* Property Image */}
            <div className="property-image">
              <img 
                src={property.image || property.images?.[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={property.title}
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                onError={(e) => {
                  e.target.src = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400';
                }}
              />
              <div className="property-status-badge">
                {getStatusBadge(property.status)}
              </div>
              <div className="property-price-badge">
                {formatPrice(property.price, property.type)}
              </div>
            </div>
            
            {/* Property Details */}
            <div className="property-content">
              <h3 className="property-title">
                {property.title}
              </h3>
              
              {property.status === 'pending_approval' && (
                <div style={{display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px'}}>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleApprove(property.id);
                    }}
                    className="property-action-btn property-approve-btn"
                    title="Approve Property"
                  >
                    <Check size={14} />
                    <span>Approve</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleReject(property);
                    }}
                    className="property-action-btn property-reject-btn"
                    title="Reject Property"
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              )}
              
              <div className="property-location">
                <MapPin size={14} style={{marginRight: '4px'}} />
                <span>{property.location}</span>
              </div>
              
              <div className="property-details">
                <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                <span>{property.area} sq ft</span>
              </div>
              
              <div className="property-meta">
                <span>Agent: {property.agentName || property.agent}</span>
                <span>{property.views} views</span>
              </div>
              
              {/* Actions */}
              <div className="property-actions">
                <Link 
                  to={`/admin/properties/view/${property.id}`}
                  className="action-btn view"
                  title="View Details"
                >
                  <Eye size={12} />
                </Link>
                <Link 
                  to={`/admin/properties/edit/${property.id}`}
                  className="action-btn edit"
                  title="Edit Property"
                >
                  <Edit size={12} />
                </Link>
                {property.status === 'active' && property.status !== 'featured' && (
                  <button 
                    onClick={() => handleFeature(property.id)}
                    className="action-btn"
                    style={{backgroundColor: '#8b5cf6', color: 'white'}}
                    title="Feature Property"
                  >
                    ⭐
                  </button>
                )}
                {property.status === 'featured' && (
                  <button 
                    onClick={() => handleUnfeature(property.id)}
                    className="action-btn"
                    style={{backgroundColor: '#f59e0b', color: 'white'}}
                    title="Remove from Featured"
                  >
                    ⭐
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(property.id)}
                  className="action-btn delete"
                  title="Delete Property"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <Link to="/admin/properties/add" className="btn btn-primary">
            <Plus size={16} />
            Add First Property
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-wrapper">
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="logout-modal">
            <div className="logout-modal-header">
              <h3 className="logout-modal-title">
                <X size={20} className="text-red-500" />
                Reject Listing - {selectedProperty?.title}
              </h3>
            </div>
            <div className="logout-modal-body">
              <div className="form-group" style={{marginBottom: '16px'}}>
                <label className="form-label">Reason for Rejection *</label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select a reason</option>
                  {REJECTION_REASONS.map(reason => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>
              {rejectionReason === 'other' && (
                <div className="form-group">
                  <label className="form-label">Additional Notes *</label>
                  <textarea
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    className="form-textarea"
                    rows="3"
                    placeholder="Please provide specific details..."
                    required
                  />
                </div>
              )}
            </div>
            <div className="logout-modal-actions">
              <button 
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setRejectionNotes('');
                  setSelectedProperty(null);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={confirmReject}
                className="btn btn-danger"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;