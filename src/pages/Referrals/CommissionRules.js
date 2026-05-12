import React, { useState, useEffect } from 'react';
import { Save, Settings, Percent, DollarSign } from 'lucide-react';
import { REFERRAL_MODES } from '../../constants';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const CommissionRules = () => {
  const [settings, setSettings] = useState({
    programEnabled: true,
    referralMode: 'standard',
    standardCommission: 10,
    level1Commission: 8,
    level2Commission: 3,
    minimumPayout: 50,
    payoutFrequency: 'monthly'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await APIService.getReferralSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings');
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await APIService.updateReferralSettings(settings);
      toast.success('Commission rules updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (mode) => {
    if (mode !== settings.referralMode) {
      if (window.confirm('Changing referral mode will affect all existing affiliates. Are you sure?')) {
        handleChange('referralMode', mode);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Commission Rules</h1>
        <button onClick={handleSave} disabled={loading} className="btn btn-primary">
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Settings size={20} />
              Program Settings
            </h3>
          </div>
          <div className="card-content space-y-4">
            <div className="form-group">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.programEnabled}
                  onChange={(e) => handleChange('programEnabled', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="form-label">Enable Affiliate Program</span>
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Disabling will stop all affiliate tracking immediately
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Referral Mode</label>
              <div className="space-y-2">
                {REFERRAL_MODES.map(mode => (
                  <label key={mode.value} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="referralMode"
                      value={mode.value}
                      checked={settings.referralMode === mode.value}
                      onChange={(e) => handleModeChange(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div>
                      <span className="font-medium">{mode.label}</span>
                      <p className="text-sm text-gray-600">
                        {mode.value === 'standard' 
                          ? 'Affiliates earn commission only on direct referrals'
                          : 'Affiliates earn from Level 1 and Level 2 referrals'
                        }
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Percent size={20} />
              Commission Rates
            </h3>
          </div>
          <div className="card-content space-y-4">
            {settings.referralMode === 'standard' ? (
              <div className="form-group">
                <label className="form-label">Standard Commission (%)</label>
                <div className="input-with-addon">
                  <input
                    type="number"
                    value={settings.standardCommission}
                    onChange={(e) => handleChange('standardCommission', parseFloat(e.target.value))}
                    className="form-input"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="input-addon">%</span>
                </div>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Level 1 Commission (%)</label>
                  <div className="input-with-addon">
                    <input
                      type="number"
                      value={settings.level1Commission}
                      onChange={(e) => handleChange('level1Commission', parseFloat(e.target.value))}
                      className="form-input"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="input-addon">%</span>
                  </div>
                  <p className="text-sm text-gray-600">Direct referrals</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Level 2 Commission (%)</label>
                  <div className="input-with-addon">
                    <input
                      type="number"
                      value={settings.level2Commission}
                      onChange={(e) => handleChange('level2Commission', parseFloat(e.target.value))}
                      className="form-input"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="input-addon">%</span>
                  </div>
                  <p className="text-sm text-gray-600">Indirect referrals</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <DollarSign size={20} />
              Payout Settings
            </h3>
          </div>
          <div className="card-content space-y-4">
            <div className="form-group">
              <label className="form-label">Minimum Payout Amount ($)</label>
              <div className="input-with-addon">
                <input
                  type="number"
                  value={settings.minimumPayout}
                  onChange={(e) => handleChange('minimumPayout', parseFloat(e.target.value))}
                  className="form-input"
                  min="0"
                  step="1"
                />
                <span className="input-addon">USD</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payout Frequency</label>
              <select
                value={settings.payoutFrequency}
                onChange={(e) => handleChange('payoutFrequency', e.target.value)}
                className="form-select"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionRules;