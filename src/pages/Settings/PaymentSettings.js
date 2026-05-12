import React, { useState, useEffect } from 'react';
import { Save, CreditCard, TestTube, AlertCircle } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const PaymentSettings = () => {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [settings, setSettings] = useState({
    selectedGateway: 'aba',
    apiKey: '',
    merchantId: '',
    secretKey: '',
    callbackUrl: '',
    testMode: true
  });

  const [errors, setErrors] = useState({});

  const paymentGateways = [
    { value: 'aba', label: 'ABA Payment Gateway' },
    { value: 'bakong', label: 'Bakong' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await APIService.getPaymentSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Failed to load payment settings');
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

    if (!settings.apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
    }

    if (!settings.merchantId.trim()) {
      newErrors.merchantId = 'Merchant ID is required';
    }

    if (!settings.secretKey.trim()) {
      newErrors.secretKey = 'Secret Key is required';
    }

    if (!settings.callbackUrl.trim()) {
      newErrors.callbackUrl = 'Callback URL is required';
    } else {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(settings.callbackUrl)) {
        newErrors.callbackUrl = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestConnection = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields before testing');
      return;
    }

    setTesting(true);

    try {
      const testResult = await APIService.testPaymentConnection(settings);
      if (testResult.success) {
        toast.success('Payment gateway connection test successful!');
      } else {
        toast.error('Connection test failed: ' + testResult.message);
      }
    } catch (error) {
      toast.error('Connection test failed. Please check your credentials.');
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // If switching to live mode, require successful test first
    if (!settings.testMode) {
      try {
        const testResult = await APIService.testPaymentConnection(settings);
        if (!testResult.success) {
          toast.error('Test connection must succeed before enabling live mode');
          return;
        }
      } catch (error) {
        toast.error('Test connection must succeed before enabling live mode');
        return;
      }
    }

    setLoading(true);

    try {
      await APIService.savePaymentSettings(settings);
      toast.success('Payment gateway settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save payment settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card-header">
        <h3 className="card-title">
          <CreditCard size={20} className="inline mr-2" />
          Payment Gateway Configuration
        </h3>
        <p className="text-sm text-gray-600">Manage payment integrations for transactions</p>
      </div>

      <div className="card-content space-y-6">
        {/* Gateway Selection */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Payment Gateway</h4>
          
          <div className="form-group">
            <label htmlFor="selectedGateway" className="form-label">
              Select Gateway
            </label>
            <select
              id="selectedGateway"
              name="selectedGateway"
              value={settings.selectedGateway}
              onChange={handleChange}
              className="form-select"
            >
              {paymentGateways.map(gateway => (
                <option key={gateway.value} value={gateway.value}>
                  {gateway.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* API Configuration */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">API Configuration</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="apiKey" className="form-label">
                API Key *
              </label>
              <input
                type="password"
                id="apiKey"
                name="apiKey"
                value={settings.apiKey}
                onChange={handleChange}
                className={`form-input ${errors.apiKey ? 'border-red-500' : ''}`}
                placeholder="Enter API key"
              />
              {errors.apiKey && <p className="text-red-500 text-sm mt-1">{errors.apiKey}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="merchantId" className="form-label">
                Merchant ID *
              </label>
              <input
                type="text"
                id="merchantId"
                name="merchantId"
                value={settings.merchantId}
                onChange={handleChange}
                className={`form-input ${errors.merchantId ? 'border-red-500' : ''}`}
                placeholder="Enter merchant ID"
              />
              {errors.merchantId && <p className="text-red-500 text-sm mt-1">{errors.merchantId}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="secretKey" className="form-label">
                Secret Key *
              </label>
              <input
                type="password"
                id="secretKey"
                name="secretKey"
                value={settings.secretKey}
                onChange={handleChange}
                className={`form-input ${errors.secretKey ? 'border-red-500' : ''}`}
                placeholder="Enter secret key"
              />
              {errors.secretKey && <p className="text-red-500 text-sm mt-1">{errors.secretKey}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="callbackUrl" className="form-label">
                Callback URL *
              </label>
              <input
                type="url"
                id="callbackUrl"
                name="callbackUrl"
                value={settings.callbackUrl}
                onChange={handleChange}
                className={`form-input ${errors.callbackUrl ? 'border-red-500' : ''}`}
                placeholder="https://yoursite.com/payment/callback"
              />
              {errors.callbackUrl && <p className="text-red-500 text-sm mt-1">{errors.callbackUrl}</p>}
            </div>
          </div>
        </div>

        {/* Mode Configuration */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Mode Configuration</h4>
          
          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="testMode"
                checked={settings.testMode}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm text-gray-700">Test Mode</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              {settings.testMode ? 'Currently in test mode - no real transactions will be processed' : 'Live mode - real transactions will be processed'}
            </p>
          </div>

          {!settings.testMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Live Mode Warning
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>You are enabling live mode. Real transactions will be processed and charged. Make sure all settings are correct.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card-footer flex gap-3">
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={testing}
          className="btn btn-secondary"
        >
          <TestTube size={16} />
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Payment Configurations'}
        </button>
      </div>
    </form>
  );
};

export default PaymentSettings;