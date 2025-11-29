import React, { useState } from "react";
import { User, Bell, Shield, Palette, Save, AlertCircle, Settings as SettingsIcon } from "lucide-react";
import Toast from "../../components/Toast";
import "./settings-styles.css";

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const defaults = {
      name: "Sunil Kumar",
      email: "sunil.kumar@aurora.app",
      bio: "Admin of Aurora employee management system",
      emailNotifications: true,
      pushNotifications: false,
      newEmployeeAlerts: true,
      systemUpdates: true,
      weeklyReports: false,
      language: "en",
      timezone: "Asia/Kolkata",
      autoBackup: true,
      dataRetention: "3years",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorAuth: false,
    };
    const saved = localStorage.getItem("userSettings");
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
  ];

  const updateSetting = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
    if (
      settings.newPassword ||
      settings.confirmPassword ||
      settings.currentPassword
    ) {
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
      setToast({
        type: "error",
        message: "Please fix the errors before saving.",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage
      const settingsToSave = { ...settings };
      // Don't save password fields for security
      delete settingsToSave.currentPassword;
      delete settingsToSave.newPassword;
      delete settingsToSave.confirmPassword;

      localStorage.setItem("userSettings", JSON.stringify(settingsToSave));

      // Reset password fields
      setSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setToast({ type: "success", message: "Settings saved successfully!" });
    } catch {
      setToast({
        type: "error",
        message: "Failed to save settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="settings-section">
            <div className="settings-profile-header">
              <img
                src="https://api.dicebear.com/9.x/micah/svg?seed=Felix"
                alt="Profile"
                className="settings-profile-avatar"
              />
              <div className="settings-profile-info">
                <h3>{settings.name}</h3>
                <p>Administrator</p>
              </div>
            </div>

            <div className="settings-grid">
              <div className="settings-form-group">
                <input
                  type="text"
                  value={settings.name}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("name", e.target.value)}
                  className={`settings-input ${errors.name ? "error" : ""}`}
                  placeholder=" "
                  aria-invalid={errors.name ? "true" : "false"}
                />
                <label className="settings-label">Full Name</label>
                {errors.name && (
                  <p className="settings-error-message">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              <div className="settings-form-group">
                <input
                  type="email"
                  value={settings.email}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("email", e.target.value)}
                  className={`settings-input ${errors.email ? "error" : ""}`}
                  placeholder=" "
                  aria-invalid={errors.email ? "true" : "false"}
                />
                <label className="settings-label">Email</label>
                {errors.email && (
                  <p className="settings-error-message">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="settings-form-group">
              <textarea
                value={settings.bio}
                disabled={isSaving}
                onChange={(e) => updateSetting("bio", e.target.value)}
                rows={3}
                className="settings-textarea"
                placeholder=" "
              />
              <label className="settings-label">Bio</label>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="settings-section">
            {[
              {
                key: "emailNotifications",
                label: "Email notifications",
                desc: "Receive email updates",
              },
              {
                key: "pushNotifications",
                label: "Push notifications",
                desc: "Browser notifications",
              },
              {
                key: "newEmployeeAlerts",
                label: "New employee alerts",
                desc: "When employees are added",
              },
              {
                key: "systemUpdates",
                label: "System updates",
                desc: "Maintenance notifications",
              },
              {
                key: "weeklyReports",
                label: "Weekly reports",
                desc: "Summary reports via email",
              },
            ].map(({ key, label, desc }) => (
              <div key={key} className="settings-toggle-wrapper">
                <div>
                  <label className="font-medium text-main" htmlFor={key}>
                    {label}
                  </label>
                  <p className="text-sm text-muted">{desc}</p>
                </div>
                <label className="settings-toggle-label" htmlFor={key}>
                  <input
                    id={key}
                    type="checkbox"
                    checked={settings[key]}
                    disabled={isSaving}
                    onChange={(e) => updateSetting(key, e.target.checked)}
                    className="settings-toggle-input"
                    aria-label={label}
                  />
                  <div className="settings-toggle-slider"></div>
                </label>
              </div>
            ))}
          </div>
        );

      case "system":
        return (
          <div className="settings-section">
            <div className="settings-grid">
              <div className="settings-form-group">
                <select
                  value={settings.language}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("language", e.target.value)}
                  className="settings-select"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
                <label className="settings-label">Language</label>
              </div>

              <div className="settings-form-group">
                <select
                  value={settings.timezone}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("timezone", e.target.value)}
                  className="settings-select"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
                <label className="settings-label">Timezone</label>
              </div>

              <div className="settings-form-group">
                <select
                  value={settings.dataRetention}
                  disabled={isSaving}
                  onChange={(e) =>
                    updateSetting("dataRetention", e.target.value)
                  }
                  className="settings-select"
                >
                  <option value="1year">1 Year</option>
                  <option value="2years">2 Years</option>
                  <option value="3years">3 Years</option>
                  <option value="forever">Forever</option>
                </select>
                <label className="settings-label">Data Retention</label>
              </div>
            </div>

            <div className="settings-toggle-wrapper">
              <div>
                <label className="font-medium text-main" htmlFor="autoBackup">
                  Automatic backups
                </label>
                <p className="text-sm text-muted">Daily data backup</p>
              </div>
              <label className="settings-toggle-label" htmlFor="autoBackup">
                <input
                  id="autoBackup"
                  type="checkbox"
                  checked={settings.autoBackup}
                  disabled={isSaving}
                  onChange={(e) =>
                    updateSetting("autoBackup", e.target.checked)
                  }
                  className="settings-toggle-input"
                  aria-label="Automatic backups"
                />
                <div className="settings-toggle-slider"></div>
              </label>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="settings-section">
            <div className="settings-form-group">
              <input
                type="password"
                value={settings.currentPassword}
                disabled={isSaving}
                onChange={(e) =>
                  updateSetting("currentPassword", e.target.value)
                }
                className={`settings-input ${errors.currentPassword ? "error" : ""}`}
                placeholder=" "
                aria-invalid={errors.currentPassword ? "true" : "false"}
              />
              <label className="settings-label">Current Password</label>
              {errors.currentPassword && (
                <p className="settings-error-message">
                  <AlertCircle size={12} /> {errors.currentPassword}
                </p>
              )}
            </div>

            <div className="settings-form-group">
              <input
                type="password"
                value={settings.newPassword}
                disabled={isSaving}
                onChange={(e) => updateSetting("newPassword", e.target.value)}
                className={`settings-input ${errors.newPassword ? "error" : ""}`}
                placeholder=" "
                aria-invalid={errors.newPassword ? "true" : "false"}
              />
              <label className="settings-label">New Password</label>
              {errors.newPassword && (
                <p className="settings-error-message">
                  <AlertCircle size={12} /> {errors.newPassword}
                </p>
              )}
            </div>

            <div className="settings-form-group">
              <input
                type="password"
                value={settings.confirmPassword}
                disabled={isSaving}
                onChange={(e) =>
                  updateSetting("confirmPassword", e.target.value)
                }
                className={`settings-input ${errors.confirmPassword ? "error" : ""}`}
                placeholder=" "
                aria-invalid={errors.confirmPassword ? "true" : "false"}
              />
              <label className="settings-label">Confirm Password</label>
              {errors.confirmPassword && (
                <p className="settings-error-message">
                  <AlertCircle size={12} /> {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="settings-toggle-wrapper">
              <div>
                <label
                  className="font-medium text-main"
                  htmlFor="twoFactorAuth"
                >
                  Two-factor authentication
                </label>
                <p className="text-sm text-muted">Extra security layer</p>
              </div>
              <label className="settings-toggle-label" htmlFor="twoFactorAuth">
                <input
                  id="twoFactorAuth"
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  disabled={isSaving}
                  onChange={(e) =>
                    updateSetting("twoFactorAuth", e.target.checked)
                  }
                  className="settings-toggle-input"
                  aria-label="Two-factor authentication"
                />
                <div className="settings-toggle-slider"></div>
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-main flex items-center gap-2">
            <SettingsIcon size={28} className="text-primary" />
            Settings
          </h1>
          <p className="text-muted text-sm">Manage your account and preferences</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="settings-tabs">
        <nav className="settings-tabs-nav">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`settings-tab-button ${activeTab === tab.id ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="settings-content animate-fade-in">
        {renderTabContent()}

        {/* Save Button */}
        <div className="settings-save-section">
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="settings-save-button"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
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
