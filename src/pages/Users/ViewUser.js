import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Shield, User, Activity } from 'lucide-react';
import { USER_ROLES, USER_STATUS } from '../../constants';
import { useNavigation } from '../../contexts/NavigationContext';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const ViewUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { getBackPath } = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await APIService.getUserById(id);
        if (userData) {
          setUser(userData);
        } else {
          toast.error('User not found');
          navigate('/users');
        }
      } catch (error) {
        toast.error('Failed to load user');
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [id, navigate]);

  const getStatusBadge = (status) => {
    const statusConfig = USER_STATUS.find(s => s.value === status);
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

  const getRoleBadge = (role) => {
    const roleConfig = USER_ROLES.find(r => r.value === role);
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        {roleConfig?.label || role}
      </span>
    );
  };

  const getUserInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
        <button 
          onClick={() => navigate('/users')}
          className="btn btn-primary"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="btn btn-secondary"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="page-title">User Details</h1>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
          >
            <Edit size={16} />
            Edit User
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="card">
        <div className="user-profile-header">
          <div className="flex items-center gap-6">
            <div className="user-avatar-large">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full rounded-full" />
              ) : (
                <span className="user-initials-large">
                  {getUserInitials(user.firstName, user.lastName)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="user-name">{user.firstName} {user.lastName}</h2>
              <div className="user-meta">
                <div className="flex items-center gap-4 mb-2">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone size={14} />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <User size={20} className="inline mr-2" />
              Personal Information
            </h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">First Name</label>
                <span className="info-value">{user.firstName}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Last Name</label>
                <span className="info-value">{user.lastName}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Email</label>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Phone</label>
                <span className="info-value">{user.phone}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Date of Birth</label>
                <span className="info-value">
                  {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </span>
              </div>
              <div className="info-item">
                <label className="info-label">User Type</label>
                <span className="info-value">{getRoleBadge(user.role)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <MapPin size={20} className="inline mr-2" />
              Address Information
            </h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Street Address</label>
                <span className="info-value">{user.address || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label className="info-label">City</label>
                <span className="info-value">{user.city || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label className="info-label">State</label>
                <span className="info-value">{user.state || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label className="info-label">ZIP Code</label>
                <span className="info-value">{user.zipCode || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Shield size={20} className="inline mr-2" />
              Account Information
            </h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Status</label>
                <span className="info-value">{getStatusBadge(user.status)}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Join Date</label>
                <span className="info-value">
                  {new Date(user.joinDate).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <label className="info-label">Last Login</label>
                <span className="info-value">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <label className="info-label">Properties Count</label>
                <span className="info-value font-semibold">{user.propertiesCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Activity size={20} className="inline mr-2" />
              Activity & Statistics
            </h3>
          </div>
          <div className="card-content">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{user.propertiesCount}</div>
                <div className="stat-label">Properties</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {Math.floor((new Date() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="stat-label">Days Active</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {Math.floor((new Date() - new Date(user.lastLogin)) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="stat-label">Days Since Login</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {user.notes && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Notes</h3>
          </div>
          <div className="card-content">
            <p className="text-gray-700 leading-relaxed">{user.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUser;