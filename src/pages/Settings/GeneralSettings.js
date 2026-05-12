import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, Palette } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const GeneralSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    platformName: 'Real Estate Marketplace',
    defaultLanguage: 'en',
    enableGoogleTranslate: true,
    defaultTimezone: 'UTC',
    contactEmail: 'admin@realestate.com',
    contactPhone: '+1234567890',
    themeMode: 'light'
  });

  const [errors, setErrors] = useState({});

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'km', label: 'Khmer' },
    { value: 'zh', label: 'Chinese' }
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Asia/Phnom_Penh', label: 'Cambodia Time (ICT)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' }
  ];

  const themeModes = [
    { value: 'light', label: 'Light Mode' },
    { value: 'dark', label: 'Dark Mode' },
    { value: 'auto', label: 'Auto Mode' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await APIService.getSystemSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Failed to load settings');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!settings.platformName.trim()) {
      newErrors.platformName = 'Platform name is required';
    }

    if (!settings.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(settings.contactEmail)) {
        newErrors.contactEmail = 'Please enter a valid email address';
      }
    }

    if (!settings.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
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
      await APIService.saveSystemSettings(settings);
      
      // Apply theme change immediately
      if (window.updateTheme) {
        window.updateTheme(settings.themeMode);
      }
      
      toast.success('General settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card-header">
        <h3 className="card-title">
          <Globe size={20} className="inline mr-2" />
          General Settings
        </h3>
        <p className="text-sm text-gray-600">Configure platform identity and basic settings</p>
      </div>

      <div className="card-content space-y-6">
        {/* Platform Identity */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Platform Identity</h4>
          
          <div className="form-group">
            <label htmlFor="platformName" className="form-label">
              Platform Name *
            </label>
            <input
              type="text"
              id="platformName"
              name="platformName"
              value={settings.platformName}
              onChange={handleChange}
              className={`form-input ${errors.platformName ? 'border-red-500' : ''}`}
              placeholder="Enter platform name"
            />
            {errors.platformName && <p className="text-red-500 text-sm mt-1">{errors.platformName}</p>}
          </div>
        </div>

        {/* Language & Localization */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Language & Localization</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="defaultLanguage" className="form-label">
                Default Language
              </label>
              <select
                id="defaultLanguage"
                name="defaultLanguage"
                value={settings.defaultLanguage}
                onChange={handleChange}
                className="form-select"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="defaultTimezone" className="form-label">
                Default Timezone
              </label>
              <select
                id="defaultTimezone"
                name="defaultTimezone"
                value={settings.defaultTimezone}
                onChange={handleChange}
                className="form-select"
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enableGoogleTranslate"
                checked={settings.enableGoogleTranslate}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Google Translate</span>
            </label>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Contact Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="contactEmail" className="form-label">
                <Mail size={16} className="inline mr-2" />
                Contact Email *
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className={`form-input ${errors.contactEmail ? 'border-red-500' : ''}`}
                placeholder="Enter contact email"
              />
              {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone" className="form-label">
                <Phone size={16} className="inline mr-2" />
                Contact Phone *
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                className={`form-input ${errors.contactPhone ? 'border-red-500' : ''}`}
                placeholder="Enter contact phone"
              />
              {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">
            <Palette size={20} className="inline mr-2" />
            Theme Settings
          </h4>
          
          <div className="form-group">
            <label htmlFor="themeMode" className="form-label">
              Theme Mode
            </label>
            <select
              id="themeMode"
              name="themeMode"
              value={settings.themeMode}
              onChange={handleChange}
              className="form-select"
            >
              {themeModes.map(mode => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Auto mode switches based on system/browser setting
            </p>
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
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
};

export default GeneralSettings;