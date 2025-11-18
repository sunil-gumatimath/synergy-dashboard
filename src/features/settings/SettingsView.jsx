```javascript
import React, { useState } from 'react';
import { 
  User, Bell, Lock, Globe, Moon, Shield, Mail, Smartphone, 
  Check, ChevronRight, Camera, LogOut, Key, Sun, Monitor, Laptop
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
    <div className="max-w-3xl animate-in fade-in duration-300">
      <div className="flex items-start gap-6 mb-10">
        <div className="relative group">
          <img 
            src="https://api.dicebear.com/9.x/micah/svg?seed=Tedz" 
            alt="Profile" 
            className="w-20 h-20 rounded-full bg-gray-100 object-cover ring-4 ring-white shadow-sm"
          />
          <button className="absolute -bottom-1 -right-1 p-1.5 bg-white text-gray-600 rounded-full border border-gray-200 shadow-sm hover:text-indigo-600 transition-colors">
            <Camera size={14} />
          </button>
        </div>
        <div className="pt-1">
          <h3 className="text-lg font-semibold text-gray-900">{profile.fullName}</h3>
          <p className="text-sm text-gray-500">Administrator • Engineering</p>
          <div className="flex gap-3 mt-3">
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Change Avatar</button>
            <span className="text-gray-300">|</span>
            <button className="text-sm font-medium text-red-600 hover:text-red-700">Remove</button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              value={profile.fullName}
              onChange={(e) => setProfile({...profile, fullName: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input 
              type="tel" 
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <input 
              type="text" 
              defaultValue="Administrator" 
              disabled
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Bio</label>
          <textarea 
            rows="4"
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm resize-none"
          />
          <p className="text-xs text-gray-500 text-right">{240 - profile.bio.length} characters left</p>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="max-w-3xl animate-in fade-in duration-300">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
        <p className="text-sm text-gray-500 mt-1">Choose what updates you want to receive via email.</p>
      </div>

      <div className="space-y-1 divide-y divide-gray-100">
        {notifications.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-4">
            <div className="pr-8">
              <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={item.checked}
                onChange={() => {
                  setNotifications(notifications.map(n => 
                    n.id === item.id ? {...n, checked: !n.checked} : n
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
    <div className="max-w-3xl animate-in fade-in duration-300">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Security</h3>
        <p className="text-sm text-gray-500 mt-1">Manage your password and security preferences.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 pb-8 border-b border-gray-100">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Current Password</label>
            <input 
              type="password" 
              value={passwords.current}
              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <input 
              type="password" 
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
            <input 
              type="password" 
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm" 
            />
          </div>
          <button 
            onClick={handleSave}
            className="mt-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Update Password
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account.</p>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="max-w-3xl animate-in fade-in duration-300">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
        <p className="text-sm text-gray-500 mt-1">Customize how the application looks on your device.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {['light', 'dark', 'system'].map((theme) => (
          <button
            key={theme}
            onClick={() => setPreferences({...preferences, theme})}
              className={`
p - 4 rounded - lg border text - left transition - all
                ${
    preferences.theme === theme
    ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600'
    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
}
`}
          >
            <div className="mb-3 text-gray-900">
              {theme === 'light' && <Sun size={20} />}
              {theme === 'dark' && <Moon size={20} />}
              {theme === 'system' && <Laptop size={20} />}
            </div>
            <p className="font-medium text-gray-900 capitalize text-sm">{theme}</p>
          </button>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Regional</h3>
        <p className="text-sm text-gray-500 mt-1">Set your language and timezone preferences.</p>
      </div>

      <div className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Language</label>
          <select 
            value={preferences.language}
            onChange={(e) => setPreferences({...preferences, language: e.target.value})}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all bg-white text-sm"
          >
            <option value="en">English (United States)</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Timezone</label>
          <select 
            value={preferences.timezone}
            onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all bg-white text-sm"
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

  return (
    <div className="flex flex-col lg:flex-row h-full bg-white min-h-[calc(100vh-4rem)]">
      {/* Settings Sidebar */}
      <div className="w-full lg:w-64 shrink-0 border-r border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6 px-2">Settings</h2>
        <nav className="space-y-1">
          {sections.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
w - full flex items - center gap - 3 px - 3 py - 2 rounded - md text - sm font - medium transition - colors
                  ${
    isActive
        ? 'bg-gray-100 text-gray-900'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
}
`}
              >
                <Icon size={18} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                {section.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsView;
```
