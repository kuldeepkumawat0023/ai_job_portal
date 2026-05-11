import React from 'react';

const SettingsView = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <div className="space-y-4">
        <div className="border-b pb-4">Profile Information</div>
        <div className="border-b pb-4">Notification Preferences</div>
        <div>Security & Password</div>
      </div>
    </div>
  );
};

export default SettingsView;
