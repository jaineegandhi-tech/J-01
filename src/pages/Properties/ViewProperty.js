import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin, Calendar, DollarSign, User, Eye, Home, Check, X, Star, Trash2, FileText, Image, Map } from 'lucide-react';
import { PROPERTY_TYPES, PROPERTY_STATUS } from '../../constants';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const ViewProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const propertyData = await APIService.getPropertyById(id);
      if (propertyData) {
        setProperty(propertyData);
      } else {
        toast.error('Property not found');
        navigate('/admin/properties');
      }
    } catch (error) {
      toast.error('Failed to load property');
      navigate('/admin/properties');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = PROPERTY_STATUS.find(s => s.value === status);
    return (
      <span className="text-sm font-medium text-gray-700">
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

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await APIService.updateProperty(id, { status: 'active' });
      setProperty(prev => ({ ...prev, status: 'active' }));
      toast.success('Property approved successfully!');
      navigate('/admin/properties');
    } catch (error) {
      toast.error('Failed to approve property');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    setActionLoading(true);
    try {
      await APIService.updateProperty(id, { 
        status: 'rejected', 
        rejectionReason: rejectReason,
        rejectedAt: new Date().toISOString()
      });
      setProperty(prev => ({ ...prev, status: 'rejected', rejectionReason: rejectReason }));
      toast.success('Property rejected successfully!');
      setShowRejectModal(false);
      navigate('/admin/properties');
    } catch (error) {
      toast.error('Failed to reject property');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeature = async () => {
    setActionLoading(true);
    try {
      const newFeaturedStatus = !property.featured;
      await APIService.updateProperty(id, { featured: newFeaturedStatus });
      setProperty(prev => ({ ...prev, featured: newFeaturedStatus }));
      toast.success(`Property ${newFeaturedStatus ? 'featured' : 'unfeatured'} successfully!`);
    } catch (error) {
      toast.error('Failed to update property');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this property? This action cannot be undone.')) {
      setActionLoading(true);
      try {
        await APIService.deleteProperty(id);
        toast.success('Property deleted successfully!');
        navigate('/admin/properties');
      } catch (error) {
        toast.error('Failed to delete property');
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Property not found</h3>
        <button 
          onClick={() => navigate('/admin/properties')}
          className="btn btn-primary"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="page-header" style={{position: 'sticky', top: '0', zIndex: '1000', backgroundColor: 'var(--bg-color)', backdropFilter: 'blur(8px)', padding: '1rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/properties')}
            className="btn btn-secondary"
          >
            <ArrowLeft size={16} />
            Back to Properties
          </button>
          <h1 className="page-title">Property Details</h1>
        </div>
        <div className="page-actions">
          <div className="flex gap-4 flex-wrap">
            {property.status === 'pending' && (
              <>
                <button 
                  className="btn btn-success"
                  onClick={handleApprove}
                  disabled={actionLoading}
                >
                  <Check size={16} />
                  Approve Listing
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                >
                  <X size={16} />
                  Reject Listing
                </button>
              </>
            )}
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/admin/properties/edit/${property.id}`)}
              disabled={actionLoading}
            >
              <Edit size={16} />
              Edit Listing
            </button>
            <button 
              className={`btn ${property.featured ? 'btn-warning' : 'btn-secondary'}`}
              onClick={handleFeature}
              disabled={actionLoading}
            >
              <Star size={16} />
              {property.featured ? 'Unfeature' : 'Feature Listing'}
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              <Trash2 size={16} />
              Delete Listing
            </button>
          </div>
        </div>
      </div>

      {/* Property Profile Card */}
      <div className="card">
        <div className="user-profile-header">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <h2 className="user-name">{property.title}</h2>
              <div className="user-meta">
                <div className="flex items-center gap-4 mb-2">
                  {getStatusBadge(property.status)}
                  <span className="text-sm font-medium text-gray-700">
                    {formatPrice(property.price, property.type)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{property.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Home size={20} className="inline mr-2" />
              Basic Information
            </h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Property Title</label>
                <span className="info-value">{property.title}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Description</label>
                <span className="info-value">{property.description || 'No description provided'}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Property Type</label>
                <span className="info-value">{PROPERTY_TYPES.find(t => t.value === property.type)?.label || property.type}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Category</label>
                <span className="info-value">{property.category || 'Residential'}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Price</label>
                <span className="info-value">{formatPrice(property.price, property.type)}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Status</label>
                <span className="info-value">{getStatusBadge(property.status)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <MapPin size={20} className="inline mr-2" />
              Location Information
            </h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Address</label>
                <span className="info-value">{property.location}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Area</label>
                <span className="info-value">{property.area} sq ft</span>
              </div>
              <div className="info-item">
                <label className="info-label">Bedrooms</label>
                <span className="info-value">{property.bedrooms}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Bathrooms</label>
                <span className="info-value">{property.bathrooms}</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Map size={16} className="text-blue-600" />
                <span className="font-medium text-gray-700">Google Map Location</span>
              </div>
              <p className="text-sm text-gray-600">Interactive map would be displayed here in production</p>
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Image size={20} className="inline mr-2" />
              Media & Documents
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
  
              <div>
                <label className="info-label">Floor Plans</label>
                <div className="p-4 bg-gray-50 rounded text-center text-gray-500">
                  Floor plans would be displayed here
                </div>
              </div>
              <div>
                <label className="info-label">Documents</label>
                <div className="p-4 bg-gray-50 rounded text-center text-gray-500">
                  Property documents would be listed here
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linked User Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <User size={20} className="inline mr-2" />
              Linked User (Agent/Developer)
            </h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Submitted By</label>
                <span className="info-value">{property.agentName || property.agent}</span>
              </div>
              <div className="info-item">
                <label className="info-label">User Type</label>
                <span className="info-value">Agent</span>
              </div>
              <div className="info-item">
                <label className="info-label">Contact</label>
                <span className="info-value">agent@example.com</span>
              </div>
              <div className="info-item">
                <label className="info-label">Total Properties</label>
                <span className="info-value">15</span>
              </div>
            </div>
          </div>
        </div>

        {/* Listing History */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={20} className="inline mr-2" />
              Listing History
            </h3>
          </div>
          <div className="card-content">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker bg-blue-500">
                  <Calendar size={12} className="text-white" />
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h4 className="timeline-title">Property Created</h4>
                    <span className="timeline-date">
                      {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Not available'}
                    </span>
                  </div>
                  <p className="timeline-description">Initial property submission by agent</p>
                  <span className="timeline-badge bg-blue-100 text-blue-800">Created</span>
                </div>
              </div>
              
              {property.updatedAt && property.updatedAt !== property.createdAt && (
                <div className="timeline-item">
                  <div className="timeline-marker bg-orange-500">
                    <Edit size={12} className="text-white" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h4 className="timeline-title">Property Modified</h4>
                      <span className="timeline-date">
                        {new Date(property.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="timeline-description">Property details were updated</p>
                    <span className="timeline-badge bg-orange-100 text-orange-800">Modified</span>
                  </div>
                </div>
              )}
              
              {property.status === 'active' && (
                <div className="timeline-item">
                  <div className="timeline-marker bg-green-500">
                    <Check size={12} className="text-white" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h4 className="timeline-title">Property Approved</h4>
                      <span className="timeline-date">Today</span>
                    </div>
                    <p className="timeline-description">Property is now visible to clients and available for viewing</p>
                    <span className="timeline-badge bg-green-100 text-green-800">Approved</span>
                  </div>
                </div>
              )}
              
              {property.status === 'rejected' && (
                <div className="timeline-item">
                  <div className="timeline-marker bg-red-500">
                    <X size={12} className="text-white" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h4 className="timeline-title">Property Rejected</h4>
                      <span className="timeline-date">Today</span>
                    </div>
                    <p className="timeline-description">{property.rejectionReason || 'No reason provided'}</p>
                    <span className="timeline-badge bg-red-100 text-red-800">Rejected</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property Images */}
      {property.images && property.images.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Property Images</h3>
          </div>
          <div className="card-content">
            <div style={{display: 'flex', gap: '16px', overflowX: 'auto', width: '100%'}}>
              {property.images.map((image, index) => (
                <div key={index} className="flex-shrink-0 w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Description Section */}
      {property.description && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FileText size={20} className="inline mr-2" />
              Property Description
            </h3>
          </div>
          <div className="card-content">
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Reject Property Listing</h3>
              <button 
                onClick={() => setShowRejectModal(false)}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting this property listing. This will be sent to the agent/developer.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="form-textarea w-full h-32"
                required
              />
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="btn btn-secondary"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                className="btn btn-danger"
                disabled={actionLoading || !rejectReason.trim()}
              >
                {actionLoading ? 'Rejecting...' : 'Reject Listing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProperty;