import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, Calendar, Activity, Edit, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import APIService from '../../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  useEffect(() => {
    // Refresh profile data when component mounts or when returning from edit
    const handleFocus = () => {
      if (user) {
        loadProfileData();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const loadProfileData = async () => {
    try {
      if (user) {
        // Always use the authenticated user's data from auth context
        setProfileData(user);
      }
    } catch (error) {
      console.error('Failed to load profile data');
      setProfileData(user);
    } finally {
      setLoading(false);
    }
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
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <div className="page-actions">
          <button onClick={() => navigate('/admin/profile/edit')} className="btn btn-primary">
            <Edit size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <User size={20} />
            Profile Information
          </h2>
        </div>
        <div className="card-content">
          <div className="flex items-start gap-6 mb-6">
            <div className="user-avatar-large">
              <span className="user-initials-large">
                {profileData?.firstName?.[0]}{profileData?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="user-name">
                {profileData?.firstName} {profileData?.lastName}
              </h3>
              <div className="user-meta">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield size={14} />
                  <span>{profileData?.role || 'Admin'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>Last login: {new Date(profileData?.lastLogin).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label className="info-label">
                <Mail size={14} />
                Email Address
              </label>
              <span className="info-value">{profileData?.email}</span>
            </div>
            <div className="info-item">
              <label className="info-label">
                <Phone size={14} />
                Phone Number
              </label>
              <span className="info-value">{profileData?.phone || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <label className="info-label">Status</label>
              <span className={`status-badge ${profileData?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {profileData?.status}
              </span>
            </div>
            <div className="info-item">
              <label className="info-label">Member Since</label>
              <span className="info-value">{new Date(profileData?.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Account Management</h2>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="profile-action-card" onClick={() => navigate('/admin/profile/edit')}>
              <Edit size={16} className="profile-action-small-icon" />
              <div className="profile-action-content">
                <h3 className="profile-action-title">Edit Profile</h3>
                <p className="profile-action-description">Update your personal information and preferences</p>
              </div>
              <div className="profile-action-arrow">→</div>
            </div>
            
            <div className="profile-action-card" onClick={() => navigate('/admin/profile/change-password')}>
              <Key size={16} className="profile-action-small-icon" />
              <div className="profile-action-content">
                <h3 className="profile-action-title">Change Password</h3>
                <p className="profile-action-description">Update your account security credentials</p>
              </div>
              <div className="profile-action-arrow">→</div>
            </div>
            
            <div className="profile-action-card" onClick={() => navigate('/admin/profile/activity')}>
              <Activity size={16} className="profile-action-small-icon" />
              <div className="profile-action-content">
                <h3 className="profile-action-title">Activity Logs</h3>
                <p className="profile-action-description">View your login sessions and security activity</p>
              </div>
              <div className="profile-action-arrow">→</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;