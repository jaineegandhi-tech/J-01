import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { USER_ROLES } from '../../constants';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'buyer',
    status: 'active',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Function to determine the correct back navigation path based on user role
  const getBackPath = (userRole) => {
    const roleMapping = {
      'agent': '/users/agents',
      'client': '/users/clients',
      'lender': '/users/lenders',
      'advertiser': '/users/advertisers',
      'buyer': '/users/clients',
      'seller': '/users/clients',
      'landlord': '/users/lenders',
      'tenant': '/users/clients'
    };
    
    return roleMapping[userRole] || '/users';
  };

  // Load user data from API
  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const user = await APIService.getUserById(id);
      if (user) {
        setOriginalUser(user);
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'buyer',
          status: user.status || 'active',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          zipCode: user.zipCode || '',
          dateOfBirth: user.dateOfBirth || '',
          notes: user.notes || ''
        });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
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

    setSaving(true);

    try {
      await APIService.updateUser(id, formData);
      toast.success('User updated successfully!');
      navigate('/users');
    } catch (error) {
      toast.error('Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
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
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/admin/users/view/${id}`)}
            className="btn btn-secondary"
          >
            <ArrowLeft size={16} />
            Back to User Details
          </button>
          {originalUser && (
            <button
              onClick={() => navigate(getBackPath(originalUser.role))}
              className="btn btn-secondary"
            >
              Back to {originalUser.role === 'agent' ? 'Agents' : 
                      originalUser.role === 'client' || originalUser.role === 'buyer' || originalUser.role === 'seller' || originalUser.role === 'tenant' ? 'Clients' :
                      originalUser.role === 'lender' || originalUser.role === 'landlord' ? 'Lenders' :
                      originalUser.role === 'advertiser' ? 'Advertisers' : 'Users'}
            </button>
          )}
          <h1 className="page-title">Edit User</h1>
        </div>
      </div>

      {/* Edit User Form */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <h2 className="form-title">User Information</h2>
            <p className="text-sm text-gray-600">Update the user details below</p>
          </div>

          <div className="form-grid">
            {/* Personal Information */}
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                <User size={16} className="inline mr-2" />
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
                placeholder="Enter first name"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                <User size={16} className="inline mr-2" />
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
                placeholder="Enter last name"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} className="inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <Phone size={16} className="inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                <Shield size={16} className="inline mr-2" />
                User Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
              >
                {USER_ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth" className="form-label">
                <Calendar size={16} className="inline mr-2" />
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Address Information */}
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                <MapPin size={16} className="inline mr-2" />
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter street address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city" className="form-label">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter city"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state" className="form-label">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter state"
              />
            </div>

            <div className="form-group">
              <label htmlFor="zipCode" className="form-label">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter ZIP code"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              placeholder="Add any additional notes about this user..."
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;