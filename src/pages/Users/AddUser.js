import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { USER_ROLES } from '../../constants';
import APIService from '../../services/api';
import RealtimeSync from '../../services/realtimeSync';
import toast from 'react-hot-toast';

const AddUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedType = searchParams.get('type');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: preSelectedType || 'client',
    status: 'active',
    dateOfBirth: '',
    password: '',
    confirmPassword: ''
  });

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const rolesData = await APIService.getRoles();
      setRoles(rolesData.filter(role => role.status === 'active'));
    } catch (error) {
      console.error('Failed to load roles');
    }
  };

  const handleRoleChange = (roleId) => {
    setFormData(prev => ({ ...prev, roleId }));
    const role = roles.find(r => r.id === roleId);
    setSelectedRole(role);
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
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.role) newErrors.role = 'User type is required';
    if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^\+?[\d\s\-()]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password,
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString().split('T')[0],
        propertiesCount: 0
      };
      
      const newUser = await APIService.createUser(userData);
      
      // Broadcast to user app if user is an agent
      if (formData.role === 'agent') {
        RealtimeSync.connect();
        RealtimeSync.broadcastAgentCreated({
          id: newUser.id,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          licenseNumber: `RE${newUser.id}`,
          agency: 'Default Agency',
          location: formData.city || 'Not specified',
          specialization: 'Residential',
          rating: 0,
          reviewCount: 0,
          transactionCount: 0,
          photo: '/api/placeholder/150/150',
          languages: ['English'],
          experience: 0
        });
      }
      
      toast.success('User created successfully!');
      if (preSelectedType) {
        navigate(`/admin/users/${preSelectedType}`);
      } else {
        navigate('/admin/users');
      }
    } catch (error) {
      toast.error('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const targetPath = preSelectedType ? `/admin/users/${preSelectedType}` : '/admin/users';
    if (Object.values(formData).some(value => value.trim() !== '')) {
      if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        navigate(targetPath);
      }
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(preSelectedType ? `/admin/users/${preSelectedType}` : '/admin/users')} className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back to {preSelectedType ? preSelectedType.charAt(0).toUpperCase() + preSelectedType.slice(1) + 's' : 'Users'}
          </button>
          <h1 className="page-title">Add New User</h1>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <h2 className="form-title">User Information</h2>
            <p className="text-sm text-gray-600">Fill in the details to create a new user account</p>
          </div>

          <div className="form-grid">
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
              {errors.firstName && <p style={{color: 'red'}} className="text-sm mt-1">{errors.firstName}</p>}
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
              {errors.lastName && <p style={{color: 'red'}} className="text-sm mt-1">{errors.lastName}</p>}
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
                autoComplete="off"
              />
              {errors.email && <p style={{color: 'red'}} className="text-sm mt-1">{errors.email}</p>}
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
              {errors.phone && <p style={{color: 'red'}} className="text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                <Shield size={16} className="inline mr-2" />
                User Type *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`form-select ${errors.role ? 'border-red-500' : ''}`}
              >
                {USER_ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && <p style={{color: 'red'}} className="text-sm mt-1">{errors.role}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
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
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`form-input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                min="1900-01-01"
                max="2024-12-31"
              />
              {errors.dateOfBirth && <p style={{color: 'red'}} className="text-sm mt-1">{errors.dateOfBirth}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter password"
                autoComplete="new-password"
              />
              {errors.password && <p style={{color: 'red'}} className="text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p style={{color: 'red'}} className="text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;