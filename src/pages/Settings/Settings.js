import React, { useState } from 'react';
import { Settings as SettingsIcon, Globe, Shield, CreditCard } from 'lucide-react';
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';
import PaymentSettings from './PaymentSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Globe, component: GeneralSettings },
    { id: 'security', label: 'Security Settings', icon: Shield, component: SecuritySettings },
    { id: 'payments', label: 'Payment Gateway', icon: CreditCard, component: PaymentSettings }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <SettingsIcon size={24} className="inline mr-2" />
          System Settings & Configurations
        </h1>
      </div>

      {/* Settings Navigation */}
      <div className="settings-tabs-container">
        <div className="settings-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`settings-tab ${
                  activeTab === tab.id ? 'settings-tab-active' : ''
                }`}
              >
                <div className="settings-tab-icon">
                  <Icon size={20} />
                </div>
                <div className="settings-tab-content">
                  <span className="settings-tab-label">{tab.label}</span>
                  <span className="settings-tab-description">
                    {tab.id === 'general' && 'Platform identity, language & theme'}
                    {tab.id === 'security' && 'Password policy, 2FA & sessions'}
                    {tab.id === 'payments' && 'Payment gateways & configurations'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Settings Component */}
      <div className="card">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default Settings;