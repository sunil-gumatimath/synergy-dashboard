import React, { useState, useEffect } from "react";
import { User, Bell, Shield, Palette, Save, AlertCircle, Settings as SettingsIcon } from "lucide-react";
import Toast from "../../components/Toast";
import "./settings-styles.css";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { authService } from "../../services/authService";

const SettingsView = () => {
  const { user, fetchAndSetUser } = useAuth(); // Assuming fetchAndSetUser is exposed or we reload user
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for form fields
  const [settings, setSettings] = useState({
    // Profile
    name: "",
    email: "",
    bio: "",
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    newEmployeeAlerts: true,
    systemUpdates: true,
    weeklyReports: false,
    // System
    language: "en",
    timezone: "Asia/Kolkata",
    autoBackup: true,
    dataRetention: "3years",
    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
  });

  // Load initial data
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // 1. Load Profile Data from 'employees' (or user metadata)
        // user object from context already has merged employee data

        // 2. Load User Settings from 'user_settings' table
        const { data: userSettings, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) console.error("Error loading settings:", error);

        setSettings(prev => ({
          ...prev,
          // Profile defaults from user object
          name: user.name || user.user_metadata?.full_name || "",
          email: user.email || "",
          bio: user.bio || "", // Assuming bio might be added to employees table later, or just local state for now

          // Merge loaded settings if they exist
          ...(userSettings ? {
            emailNotifications: userSettings.email_notifications,
            pushNotifications: userSettings.push_notifications,
            newEmployeeAlerts: userSettings.new_employee_alerts,
            systemUpdates: userSettings.system_updates,
            weeklyReports: userSettings.weekly_reports,
            language: userSettings.language,
            timezone: userSettings.timezone,
            autoBackup: userSettings.auto_backup,
            dataRetention: userSettings.data_retention,
            twoFactorAuth: userSettings.two_factor_auth,
          } : {})
        }));

      } catch (err) {
        console.error("Failed to load settings:", err);
        setToast({ type: "error", message: "Failed to load settings." });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    // Only show System tab to Admins
    ...(user?.role === 'Admin' ? [{ id: "system", label: "System", icon: Palette }] : []),
    { id: "security", label: "Security", icon: Shield },
  ];

  const updateSetting = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
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

    // Security validation
    if (settings.newPassword || settings.confirmPassword) {
      if (!settings.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (settings.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
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
      setToast({ type: "error", message: "Please fix the errors before saving." });
      return;
    }

    setIsSaving(true);
    setToast(null);

    try {
      // 1. Update Profile (Employees Table)
      // Only if name changed
      if (settings.name !== user.name) {
        // Update employees table
        if (user.employeeId) {
          const { error: profileError } = await supabase
            .from('employees')
            .update({ name: settings.name })
            .eq('id', user.employeeId);

          if (profileError) throw profileError;
        }

        // Also update auth metadata
        await supabase.auth.updateUser({
          data: { full_name: settings.name }
        });
      }

      // 2. Update User Settings (user_settings Table)
      const settingsPayload = {
        user_id: user.id,
        email_notifications: settings.emailNotifications,
        push_notifications: settings.pushNotifications,
        new_employee_alerts: settings.newEmployeeAlerts,
        system_updates: settings.systemUpdates,
        weekly_reports: settings.weeklyReports,
        language: settings.language,
        timezone: settings.timezone,
        auto_backup: settings.autoBackup,
        data_retention: settings.dataRetention,
        two_factor_auth: settings.twoFactorAuth,
        updated_at: new Date().toISOString(),
      };

      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert(settingsPayload);

      if (settingsError) throw settingsError;

      // 3. Update Password if provided
      if (settings.newPassword) {
        const { error: passwordError } = await authService.updatePassword(settings.newPassword);
        if (passwordError) throw passwordError;

        setSettings(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
        setToast({ type: "success", message: "Settings and password updated successfully!" });
      } else {
        setToast({ type: "success", message: "Settings saved successfully!" });
      }

    } catch (err) {
      console.error("Save error:", err);
      setToast({
        type: "error",
        message: err.message || "Failed to save settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return <div className="p-8 text-center text-muted">Loading settings...</div>;
    }

    switch (activeTab) {
      case "profile":
        return (
          <div className="settings-section">
            <div className="settings-profile-header">
              <img
                src={user?.avatar || `https://api.dicebear.com/9.x/micah/svg?seed=${settings.name}`}
                alt="Profile"
                className="settings-profile-avatar"
              />
              <div className="settings-profile-info">
                <h3>{settings.name}</h3>
                <p>{user?.role || "User"}</p>
                <p className="text-sm text-muted">{user?.email}</p>
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
                  disabled={true} // Email cannot be changed here
                  className="settings-input opacity-70 cursor-not-allowed"
                  placeholder=" "
                />
                <label className="settings-label">Email</label>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
              To change your email address or avatar, please contact your system administrator.
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="settings-section">
            {[
              { key: "emailNotifications", label: "Email notifications", desc: "Receive email updates" },
              { key: "pushNotifications", label: "Push notifications", desc: "Browser notifications" },
              { key: "newEmployeeAlerts", label: "New employee alerts", desc: "When employees are added" },
              { key: "systemUpdates", label: "System updates", desc: "Maintenance notifications" },
              { key: "weeklyReports", label: "Weekly reports", desc: "Summary reports via email" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="settings-toggle-wrapper">
                <div>
                  <label className="font-medium text-main" htmlFor={key}>{label}</label>
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
                  />
                  <div className="settings-toggle-slider"></div>
                </label>
              </div>
            ))}
          </div>
        );

      case "system":
        if (user?.role !== 'Admin') return null;
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
                  onChange={(e) => updateSetting("dataRetention", e.target.value)}
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
                <label className="font-medium text-main" htmlFor="autoBackup">Automatic backups</label>
                <p className="text-sm text-muted">Daily data backup</p>
              </div>
              <label className="settings-toggle-label" htmlFor="autoBackup">
                <input
                  id="autoBackup"
                  type="checkbox"
                  checked={settings.autoBackup}
                  disabled={isSaving}
                  onChange={(e) => updateSetting("autoBackup", e.target.checked)}
                  className="settings-toggle-input"
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
                value={settings.newPassword}
                disabled={isSaving}
                onChange={(e) => updateSetting("newPassword", e.target.value)}
                className={`settings-input ${errors.newPassword ? "error" : ""}`}
                placeholder=" "
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
                onChange={(e) => updateSetting("confirmPassword", e.target.value)}
                className={`settings-input ${errors.confirmPassword ? "error" : ""}`}
                placeholder=" "
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
                <label className="font-medium text-main" htmlFor="twoFactorAuth">Two-factor authentication</label>
                <p className="text-sm text-muted">Extra security layer (Coming Soon)</p>
              </div>
              <label className="settings-toggle-label" htmlFor="twoFactorAuth">
                <input
                  id="twoFactorAuth"
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  disabled={true} // Disabled for now
                  className="settings-toggle-input opacity-50 cursor-not-allowed"
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
            disabled={isSaving || isLoading}
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
