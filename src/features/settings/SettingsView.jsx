import React, { useState, useEffect } from "react";
import { User, Bell, Shield, Palette, Save, AlertCircle } from "lucide-react";
import Toast from "../../components/Toast";

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const defaults = {
      name: "Sunil Kumar",
      email: "sunil.kumar@staffly.com",
      bio: "Admin of Staffly employee management system",
      emailNotifications: true,
      pushNotifications: false,
      newEmployeeAlerts: true,
      systemUpdates: true,
      weeklyReports: false,
      theme: "light",
      language: "en",
      timezone: "Asia/Kolkata",
      autoBackup: true,
      dataRetention: "3years",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorAuth: false
    };
    const saved = localStorage.getItem('userSettings');
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: Palette },
    { id: "security", label: "Security", icon: Shield }
  ];

  // Apply theme changes to document
  useEffect(() => {
    const applyTheme = () => {
      let theme = settings.theme;
      if (theme === 'auto') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', theme);
    };

    applyTheme();

    // Listen for system theme changes if in auto mode
    if (settings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const updateSetting = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Profile validation
    if (!settings.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!settings.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Security validation (only if any password field is filled)
    if (settings.newPassword || settings.confirmPassword || settings.currentPassword) {
      if (!settings.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }
      if (!settings.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (settings.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      }
      if (settings.newPassword !== settings.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveSettings = async () => {
    if (!validateForm()) {
      setToast({ type: 'error', message: 'Please fix the errors before saving.' });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage
      const settingsToSave = { ...settings };
      // Don't save password fields for security
      delete settingsToSave.currentPassword;
      delete settingsToSave.newPassword;
      delete settingsToSave.confirmPassword;

      localStorage.setItem('userSettings', JSON.stringify(settingsToSave));

      // Reset password fields
      setSettings(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

      setToast({ type: 'success', message: 'Settings saved successfully!' });
    } catch {
      setToast({ type: 'error', message: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <img
                src="https://api.dicebear.com/9.x/micah/svg?seed=Felix"
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900">{settings.name}</h3>
                <p className="text-sm text-gray-500">Administrator</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={settings.name}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("name", e.target.value)}
                  className={`w-full px-0 py-2 border-0 border-b focus:border-primary focus:outline-none bg-transparent ${errors.name ? 'border-red-500' : 'border-gray-200'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name}
                </p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("email", e.target.value)}
                  className={`w-full px-0 py-2 border-0 border-b focus:border-primary focus:outline-none bg-transparent ${errors.email ? 'border-red-500' : 'border-gray-200'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email}
                </p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={settings.bio}
                disabled={isSaving}
                onChange={(e) => updateSetting("bio", e.target.value)}
                rows={3}
                className={`w-full px-0 py-2 border-0 border-b border-gray-200 focus:border-primary focus:outline-none bg-transparent resize-none ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4">
            {[
              { key: "emailNotifications", label: "Email notifications", desc: "Receive email updates" },
              { key: "pushNotifications", label: "Push notifications", desc: "Browser notifications" },
              { key: "newEmployeeAlerts", label: "New employee alerts", desc: "When employees are added" },
              { key: "systemUpdates", label: "System updates", desc: "Maintenance notifications" },
              { key: "weeklyReports", label: "Weekly reports", desc: "Summary reports via email" }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[key]}
                    disabled={isSaving}
                    onChange={(e) => updateSetting(key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        );

      case "system":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Theme</label>
                <select
                  value={settings.theme}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("theme", e.target.value)}
                  className={`w-full px-0 py-2 border-0 border-b border-gray-200 focus:border-primary focus:outline-none bg-transparent ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Language</label>
                <select
                  value={settings.language}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("language", e.target.value)}
                  className={`w-full px-0 py-2 border-0 border-b border-gray-200 focus:border-primary focus:outline-none bg-transparent ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Timezone</label>
                <select
                  value={settings.timezone}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("timezone", e.target.value)}
                  className={`w-full px-0 py-2 border-0 border-b border-gray-200 focus:border-primary focus:outline-none bg-transparent ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Data Retention</label>
                <select
                  value={settings.dataRetention}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("dataRetention", e.target.value)}
                  className={`w-full px-0 py-2 border-0 border-b border-gray-200 focus:border-primary focus:outline-none bg-transparent ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="1year">1 Year</option>
                  <option value="2years">2 Years</option>
                  <option value="3years">3 Years</option>
                  <option value="forever">Forever</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Automatic backups</p>
                <p className="text-sm text-gray-500">Daily data backup</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("autoBackup", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={settings.currentPassword}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("currentPassword", e.target.value)}
                  className={`w-full px-0 py-2 border-0 border-b focus:border-primary focus:outline-none bg-transparent ${errors.currentPassword ? 'border-red-500' : 'border-gray-200'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter current password"
                />
                {errors.currentPassword && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.currentPassword}
                </p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={settings.newPassword}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("newPassword", e.target.value)}
                  className={`w-full px-0 py-2 border-0 border-b focus:border-primary focus:outline-none bg-transparent ${errors.newPassword ? 'border-red-500' : 'border-gray-200'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter new password"
                />
                {errors.newPassword && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.newPassword}
                </p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={settings.confirmPassword}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("confirmPassword", e.target.value)}
                  className={`w-full px-0 py-2 border-0 border-b focus:border-primary focus:outline-none bg-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.confirmPassword}
                </p>}
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Two-factor authentication</p>
                <p className="text-sm text-gray-500">Extra security layer</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("twoFactorAuth", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-12">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <Icon size={20} />
                <span className="min-w-0">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-2xl">
        {renderTabContent()}

        {/* Save Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90'
              } text-white`}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default SettingsView;
