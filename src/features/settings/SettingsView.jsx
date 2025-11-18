import React, { useState } from 'react';
import {
  User, Bell, Globe, Moon, Shield,
  Camera, LogOut, Sun, Laptop
} from 'lucide-react';

const SettingsView = () => {
  const [activeSection, setActiveSection] = useState('profile');

  // Profile State
  const [profile, setProfile] = useState({
    fullName: 'Tedz Admin',
    email: 'tedz@staffly.com',
    phone: '+1 (555) 123-4567',
    bio: 'Senior Administrator managing the engineering department resources and timelines.'
  });

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New employee registration", desc: "Receive alerts when a new employee joins the company", checked: true },
    { id: 2, title: "Leave requests", desc: "Get notified immediately when an employee requests time off", checked: true },
    { id: 3, title: "Performance reviews", desc: "Reminders for upcoming performance reviews and deadlines", checked: true },
    { id: 4, title: "System updates", desc: "Important updates about the Staffly platform features", checked: false },
    { id: 5, title: "Weekly Analytics Report", desc: "Receive a summary of weekly performance metrics", checked: false }
  ]);

  // Security State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC-5'
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      alert('Signing out...');
    }
  };

  const sections = [
    { id: 'profile', label: 'My Profile', icon: User, description: 'Personal information' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alert preferences' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password & 2FA' },
    { id: 'preferences', label: 'Preferences', icon: Globe, description: 'App customization' },
  ];

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="relative group">
          <img
            src="https://api.dicebear.com/9.x/micah/svg?seed=Tedz"
            alt="Profile"
            className="w-20 h-20 rounded-full bg-gray-50 object-cover border border-gray-200"
          />
          <button className="absolute -bottom-1 -right-1 p-1.5 bg-white text-gray-500 rounded-full border border-gray-200 hover:text-gray-900 transition-colors">
            <Camera size={16} />
          </button>
        </div>
        <div className="flex-1 pt-2">
          <h3 className="text-lg font-semibold text-gray-900">{profile.fullName}</h3>
          <p className="text-sm text-gray-500 mt-1">Administrator - Engineering</p>
          <div className="flex gap-4 mt-3 text-sm">
            <button className="font-medium text-gray-700 hover:text-gray-900">Change Avatar</button>
            <span className="text-gray-300">|</span>
            <button className="font-medium text-red-600 hover:text-red-700">Remove</button>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white outline-none focus:border-gray-900 focus:ring-0 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white outline-none focus:border-gray-900 focus:ring-0 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white outline-none focus:border-gray-900 focus:ring-0 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              defaultValue="Administrator"
              disabled
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Bio</label>
          <textarea
            rows="4"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white outline-none focus:border-gray-900 focus:ring-0 transition-colors resize-none"
          />
          <p className="text-xs text-gray-500 text-right mt-1">{240 - profile.bio.length} characters left</p>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-black transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
        <p className="text-sm text-gray-500 mt-2">Choose what updates you want to receive via email.</p>
      </div>

      <div className="space-y-1 divide-y divide-gray-100 pt-4">
        {notifications.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-8 py-5 first:pt-0">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={item.checked}
                onChange={() => {
                  setNotifications(notifications.map(n =>
                    n.id === item.id ? { ...n, checked: !n.checked } : n
                  ));
                }}
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        <p className="text-sm text-gray-500 mt-2">Update your password to keep your account secure.</p>
      </div>

      <div className="space-y-6 pt-4">
        <div className="space-y-5 pb-6 border-b border-gray-100">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full max-w-md px-3 py-2 text-sm border border-gray-200 rounded-md bg-white outline-none focus:border-gray-900 focus:ring-0 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full max-w-md px-3 py-2 text-sm border border-gray-200 rounded-md bg-white outline-none focus:border-gray-900 focus:ring-0 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full max-w-md px-3 py-2 text-sm border border-gray-200 rounded-md bg-white outline-none focus:border-gray-900 focus:ring-0 transition-colors"
            />
          </div>
          <button
            onClick={handleSave}
            className="mt-2 px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Update Password
          </button>
        </div>

        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account.</p>
          </div>
          <button className="shrink-0 px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
        <p className="text-sm text-gray-500 mt-2">Customize how the application looks on your device.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {['light', 'dark', 'system'].map((theme) => (
          <button
            key={theme}
            onClick={() => setPreferences({ ...preferences, theme })}
            className={`p-4 rounded-md border text-left transition-colors ${preferences.theme === theme
                ? 'border-gray-900 bg-white'
                : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <div className="mb-3 text-gray-700">
              {theme === 'light' && <Sun size={20} />}
              {theme === 'dark' && <Moon size={20} />}
              {theme === 'system' && <Laptop size={20} />}
            </div>
            <p className="font-medium text-gray-900 capitalize text-sm">{theme}</p>
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Regional Settings</h3>
        <p className="text-sm text-gray-500 mt-2">Set your language and timezone preferences.</p>
      </div>

      <div className="space-y-5 max-w-md pt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Language</label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white outline-none focus:border-gray-900 focus:ring-0 transition-colors"
          >
            <option value="en">English (United States)</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Timezone</label>
          <select
            value={preferences.timezone}
            onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white outline-none focus:border-gray-900 focus:ring-0 transition-colors"
          >
            <option value="UTC-5">Eastern Time (US & Canada)</option>
            <option value="UTC-8">Pacific Time (US & Canada)</option>
            <option value="UTC+0">UTC</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSection();
      case 'notifications': return renderNotificationsSection();
      case 'security': return renderSecuritySection();
      case 'preferences': return renderPreferencesSection();
      default: return null;
    }
  };

  const activeSectionMeta = sections.find(section => section.id === activeSection);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6 items-start">
        <aside className="bg-white border border-gray-200 rounded-lg p-0 overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Settings</h2>
            <p className="text-xs text-gray-500 mt-1">Manage your workspace preferences</p>
          </div>
          <nav className="p-3 flex flex-col gap-1">
            {sections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-start gap-3 px-3 py-3 rounded-md text-left transition-colors ${isActive
                      ? 'bg-gray-50 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <Icon size={18} className={`mt-0.5 shrink-0 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                  <span className="flex flex-col min-w-0">
                    <span className="text-sm font-medium">{section.label}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{section.description}</span>
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="px-4 py-3 border-t border-gray-100 bg-white">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 border border-red-100 rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        <section className="bg-white border border-gray-200 rounded-lg p-0">
          <div className="px-8 py-6 border-b border-gray-100">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium">Active Section</p>
            <h3 className="text-xl font-semibold text-gray-900 mt-3">{activeSectionMeta?.label}</h3>
            <p className="text-sm text-gray-500 mt-1">{activeSectionMeta?.description}</p>
          </div>
          <div className="p-8">
            {renderContent()}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
