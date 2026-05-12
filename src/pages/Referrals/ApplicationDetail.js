import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, User, Mail, Phone, MapPin, FileText, Calendar } from 'lucide-react';
import { APPLICATION_STATUS, REJECTION_REASONS } from '../../constants';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    try {
      const data = await APIService.getAffiliateApplication(id);
      setApplication(data);
    } catch (error) {
      toast.error('Failed to load application');
      navigate('/referrals/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (window.confirm('Are you sure you want to approve this application? This will generate a referral code and grant dashboard access.')) {
      try {
        await APIService.approveAffiliateApplication(id);
        toast.success('Application approved successfully!');
        loadApplication();
      } catch (error) {
        toast.error('Failed to approve application');
      }
    }
  };

  const handleReject = async () => {
    const reason = rejectionReason === 'other' ? customReason : rejectionReason;
    if (!reason) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await APIService.rejectAffiliateApplication(id, { reason });
      toast.success('Application rejected successfully!');
      setShowRejectModal(false);
      loadApplication();
    } catch (error) {
      toast.error('Failed to reject application');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = APPLICATION_STATUS.find(s => s.value === status);
    return (
      <span 
        className="status-badge large"
        style={{ 
          backgroundColor: `${statusConfig?.color}20`,
          color: statusConfig?.color 
        }}
      >
        {statusConfig?.label || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!application) {
    return <div>Application not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/referrals/applications')}
            className="btn btn-secondary"
          >
            <ArrowLeft size={16} />
            Back to Applications
          </button>
          <div>
            <h1 className="page-title">Application Details</h1>
            <p className="text-sm text-gray-600">ID: {application.applicationId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(application.status)}
          {application.status === 'pending' && (
            <div className="flex gap-2">
              <button onClick={handleApprove} className="btn btn-success">
                <Check size={16} />
                Approve
              </button>
              <button onClick={() => setShowRejectModal(true)} className="btn btn-danger">
                <X size={16} />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="detail-section">
          <div className="section-header">
            <h3><User size={20} /> Applicant Information</h3>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Full Name</div>
              <div className="info-value">{application.fullName}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Email Address</div>
              <div className="info-value">{application.email}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Phone Number</div>
              <div className="info-value">{application.phone}</div>
            </div>
            <div className="info-item">
              <div className="info-label">User Type</div>
              <div className="info-value capitalize">{application.userType}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Country</div>
              <div className="info-value">{application.country}</div>
            </div>
            <div className="info-item">
              <div className="info-label">City</div>
              <div className="info-value">{application.city}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Payout Method</div>
              <div className="info-value">{application.payoutMethod}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="section-header">
            <h3><FileText size={20} /> Application Metadata</h3>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Application ID</div>
              <div className="info-value font-mono">{application.applicationId}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Applied On</div>
              <div className="info-value">{new Date(application.appliedOn).toLocaleString()}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Referral Type</div>
              <div className="info-value">{application.referralType}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Current Status</div>
              <div className="info-value">{getStatusBadge(application.status)}</div>
            </div>
            {application.referralCode && (
              <div className="info-item">
                <div className="info-label">Referral Code</div>
                <div className="info-value font-mono bg-gray-100 px-2 py-1 rounded">{application.referralCode}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Reject Application</h3>
              <button onClick={() => setShowRejectModal(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Rejection Reason *</label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="form-select"
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
                  <label className="form-label">Custom Reason *</label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="form-textarea"
                    placeholder="Please provide a detailed reason..."
                    rows={3}
                  />
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowRejectModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleReject} className="btn btn-danger">
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetail;