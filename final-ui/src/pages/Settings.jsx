import React from 'react';

function Settings() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-theme2-dark dark:text-theme2-light mb-8">Settings</h1>
        
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold text-theme2-dark dark:text-theme2-light mb-6">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-theme2-dark dark:text-theme2-light mb-2">
                Name
              </label>
              <input type="text" className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme2-dark dark:text-theme2-light mb-2">
                Email
              </label>
              <input type="email" className="input w-full" disabled />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold text-theme2-dark dark:text-theme2-light mb-6">Security</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-theme2-dark dark:text-theme2-light mb-2">
                Current Password
              </label>
              <input type="password" className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme2-dark dark:text-theme2-light mb-2">
                New Password
              </label>
              <input type="password" className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme2-dark dark:text-theme2-light mb-2">
                Confirm New Password
              </label>
              <input type="password" className="input w-full" />
            </div>
            <button className="btn-primary mt-4">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;