import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Phone, Upload, Globe, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    language: 'English',
    timezone: 'UTC'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      if (user) {
        // Use the authenticated user's data from auth context
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          language: user.language || 'English',
          timezone: user.timezone || 'UTC'
        });
      }
    } catch (error) {
      toast.error('Failed to load profile data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    
    if (formData.firstName.length > 50) newErrors.firstName = 'Name cannot exceed 50 characters';
    if (formData.lastName.length > 50) newErrors.lastName = 'Name cannot exceed 50 characters';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      // Update user in localStorage
      const updatedData = await APIService.updateUser(user.id, formData);
      
      // Update auth context with new data
      updateUser(updatedData);
      
      toast.success('Profile updated successfully!');
      navigate('/admin/profile');
    } catch (error) {
      if (error.message === 'Email already exists') {
        setErrors({ email: 'This email is already in use by another user' });
        toast.error('Email already exists');
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/profile')} className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back to Profile
          </button>
          <h1 className="page-title">Edit Profile</h1>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <h2 className="form-title">Personal Information</h2>
            <p className="text-sm text-gray-600">Update your personal details and preferences</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <User size={16} className="inline mr-2" />
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
                placeholder="Enter first name"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <User size={16} className="inline mr-2" />
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
                placeholder="Enter last name"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} className="inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone size={16} className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Globe size={16} className="inline mr-2" />
                Language Preference
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="form-select"
              >
                <option value="English">English</option>
                <option value="Khmer">Khmer</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={16} className="inline mr-2" />
                Timezone
              </label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="form-select"
              >
                <option value="UTC">UTC</option>
                <option value="Asia/Phnom_Penh">Asia/Phnom_Penh</option>
                <option value="Asia/Shanghai">Asia/Shanghai</option>
                <option value="America/New_York">America/New_York</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/profile')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <div className="spinner-sm"></div> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;