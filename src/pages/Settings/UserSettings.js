import React from 'react';

const UserSettings = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">User Settings</h1>
      </div>
      
      <div className="card">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Configuration</h3>
          <p className="text-gray-600">This page will show user-related settings and permissions.</p>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;