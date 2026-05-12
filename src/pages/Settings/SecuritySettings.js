import React, { useState, useEffect } from 'react';
import { Save, Shield, Lock, Clock, Users } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const SecuritySettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    passwordExpirationDays: 90,
    twoFactorEnabled: false,
    twoFactorMethod: 'email',
    sessionTimeoutMinutes: 30,
    concurrentLoginRestriction: false
  });

  const [errors, setErrors] = useState({});

  const twoFactorMethods = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone/SMS' },
    { value: 'telegram', label: 'Telegram' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await APIService.getSecuritySettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Failed to load security settings');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (settings.passwordMinLength < 6) {
      newErrors.passwordMinLength = 'Minimum password length must be at least 6 characters';
    }

    if (settings.passwordExpirationDays < 30) {
      newErrors.passwordExpirationDays = 'Password expiration must be at least 30 days';
    }

    if (settings.sessionTimeoutMinutes < 5) {
      newErrors.sessionTimeoutMinutes = 'Session timeout must be at least 5 minutes';
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
      await APIService.saveSecuritySettings(settings);
      toast.success('Security settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save security settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card-header">
        <h3 className="card-title">
          <Shield size={20} className="inline mr-2" />
          Security Settings
        </h3>
        <p className="text-sm text-gray-600">Manage account security and platform policies</p>
      </div>

      <div className="card-content space-y-6">
        {/* Password Policy */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">
            <Lock size={18} className="inline mr-2" />
            Password Policy
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="passwordMinLength" className="form-label">
                Minimum Password Length
              </label>
              <input
                type="number"
                id="passwordMinLength"
                name="passwordMinLength"
                value={settings.passwordMinLength}
                onChange={handleChange}
                min="6"
                max="50"
                className={`form-input ${errors.passwordMinLength ? 'border-red-500' : ''}`}
              />
              {errors.passwordMinLength && <p className="text-red-500 text-sm mt-1">{errors.passwordMinLength}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="passwordExpirationDays" className="form-label">
                Password Expiration (Days)
              </label>
              <input
                type="number"
                id="passwordExpirationDays"
                name="passwordExpirationDays"
                value={settings.passwordExpirationDays}
                onChange={handleChange}
                min="30"
                max="365"
                className={`form-input ${errors.passwordExpirationDays ? 'border-red-500' : ''}`}
              />
              {errors.passwordExpirationDays && <p className="text-red-500 text-sm mt-1">{errors.passwordExpirationDays}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="passwordRequireSpecialChars"
                checked={settings.passwordRequireSpecialChars}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm text-gray-700">Require special characters in passwords</span>
            </label>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h4>
          
          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="twoFactorEnabled"
                checked={settings.twoFactorEnabled}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span>
            </label>
          </div>

          {settings.twoFactorEnabled && (
            <div className="form-group">
              <label htmlFor="twoFactorMethod" className="form-label">
                Two-Factor Method
              </label>
              <select
                id="twoFactorMethod"
                name="twoFactorMethod"
                value={settings.twoFactorMethod}
                onChange={handleChange}
                className="form-select"
              >
                {twoFactorMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Session Management */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">
            <Clock size={18} className="inline mr-2" />
            Session Management
          </h4>
          
          <div className="form-group">
            <label htmlFor="sessionTimeoutMinutes" className="form-label">
              Session Timeout (Minutes)
            </label>
            <input
              type="number"
              id="sessionTimeoutMinutes"
              name="sessionTimeoutMinutes"
              value={settings.sessionTimeoutMinutes}
              onChange={handleChange}
              min="5"
              max="480"
              className={`form-input ${errors.sessionTimeoutMinutes ? 'border-red-500' : ''}`}
            />
            {errors.sessionTimeoutMinutes && <p className="text-red-500 text-sm mt-1">{errors.sessionTimeoutMinutes}</p>}
            <p className="text-xs text-gray-500 mt-1">Auto logout after specified minutes of inactivity</p>
          </div>
        </div>

        {/* Login Restrictions */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">
            <Users size={18} className="inline mr-2" />
            Login Restrictions
          </h4>
          
          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="concurrentLoginRestriction"
                checked={settings.concurrentLoginRestriction}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm text-gray-700">Restrict concurrent logins (disallow multiple sessions)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="card-footer">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Security Settings'}
        </button>
      </div>
    </form>
  );
};

export default SecuritySettings;