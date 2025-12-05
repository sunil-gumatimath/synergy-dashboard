import React, { useState, useEffect } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  AlertCircle,
  Settings as SettingsIcon,
  Camera,
  Check,
  Moon,
  Sun,
  Monitor,
  Key,
  Mail,
  Clock,
  Calendar,
  ChevronRight,
  LogOut,
  Smartphone,
  Eye,
  EyeOff,
  Loader2,
  X
} from "lucide-react";
import Toast from "../../components/common/Toast";
import "./settings-styles.css";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { authService } from "../../services/authService";

const SettingsView = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("account");
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // State for form fields
  const [settings, setSettings] = useState({
    // Account
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: "",

    // Appearance
    theme: "system",
    accentColor: "indigo",
    compactMode: false,

    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    leaveUpdates: true,
    systemAnnouncements: true,
    weeklyDigest: false,
    mentionNotifications: true,

    // Preferences
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    startOfWeek: "monday",

    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  const [originalSettings, setOriginalSettings] = useState({});

  // Navigation items
  const navigationItems = [
    { id: "account", label: "Account", icon: User, description: "Profile & personal info" },
    { id: "appearance", label: "Appearance", icon: Palette, description: "Theme & display" },
    { id: "notifications", label: "Notifications", icon: Bell, description: "Alerts & reminders" },
    { id: "preferences", label: "Preferences", icon: Globe, description: "Language & region" },
    { id: "security", label: "Security", icon: Shield, description: "Password & 2FA" },
  ];

  // Theme options
  const themeOptions = [
    { id: "light", label: "Light", icon: Sun, description: "Bright and clean" },
    { id: "dark", label: "Dark", icon: Moon, description: "Easy on the eyes" },
    { id: "system", label: "System", icon: Monitor, description: "Match device settings" },
  ];

  // Accent color options
  const accentColors = [
    { id: "indigo", color: "#4f46e5", label: "Indigo" },
    { id: "blue", color: "#2563eb", label: "Blue" },
    { id: "violet", color: "#7c3aed", label: "Violet" },
    { id: "rose", color: "#e11d48", label: "Rose" },
    { id: "emerald", color: "#059669", label: "Emerald" },
    { id: "amber", color: "#d97706", label: "Amber" },
  ];

  // Load initial data
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Load User Settings from 'user_settings' table
        const { data: userSettings, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) console.error("Error loading settings:", error);

        // Parse name into first and last
        const nameParts = (user.name || "").split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const loadedSettings = {
          // Account
          firstName,
          lastName,
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
          avatarUrl: user.avatar || "",

          // Appearance
          theme: userSettings?.theme || "system",
          accentColor: userSettings?.accent_color || "indigo",
          compactMode: userSettings?.compact_mode || false,

          // Notifications
          emailNotifications: userSettings?.email_notifications ?? true,
          pushNotifications: userSettings?.push_notifications ?? false,
          taskReminders: userSettings?.task_reminders ?? true,
          leaveUpdates: userSettings?.leave_updates ?? true,
          systemAnnouncements: userSettings?.system_updates ?? true,
          weeklyDigest: userSettings?.weekly_reports ?? false,
          mentionNotifications: userSettings?.mention_notifications ?? true,

          // Preferences
          language: userSettings?.language || "en",
          timezone: userSettings?.timezone || "Asia/Kolkata",
          dateFormat: userSettings?.date_format || "DD/MM/YYYY",
          timeFormat: userSettings?.time_format || "12h",
          startOfWeek: userSettings?.start_of_week || "monday",

          // Security (always empty on load)
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          twoFactorEnabled: userSettings?.two_factor_auth || false,
        };

        setSettings(loadedSettings);
        setOriginalSettings(loadedSettings);

      } catch (err) {
        console.error("Failed to load settings:", err);
        setToast({ type: "error", message: "Failed to load settings." });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // Track changes
  useEffect(() => {
    const passwordFields = ['currentPassword', 'newPassword', 'confirmPassword'];
    const changed = Object.keys(settings).some(key => {
      if (passwordFields.includes(key)) {
        return settings[key] !== "";
      }
      return settings[key] !== originalSettings[key];
    });
    setHasChanges(changed);
  }, [settings, originalSettings]);

  const updateSetting = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Account validation
    if (!settings.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Security validation
    if (settings.newPassword || settings.confirmPassword) {
      if (!settings.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (settings.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(settings.newPassword)) {
        newErrors.newPassword = "Password must include uppercase, lowercase, and number";
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
      const fullName = `${settings.firstName} ${settings.lastName}`.trim();

      // 1. Update Profile (Employees Table)
      if (fullName !== user.name) {
        if (user.employeeId) {
          const { error: profileError } = await supabase
            .from('employees')
            .update({ name: fullName })
            .eq('id', user.employeeId);

          if (profileError) throw profileError;
        }

        // Also update auth metadata
        await supabase.auth.updateUser({
          data: { full_name: fullName }
        });
      }

      // 2. Update User Settings
      const settingsPayload = {
        user_id: user.id,
        // Appearance
        theme: settings.theme,
        accent_color: settings.accentColor,
        compact_mode: settings.compactMode,
        // Notifications
        email_notifications: settings.emailNotifications,
        push_notifications: settings.pushNotifications,
        task_reminders: settings.taskReminders,
        leave_updates: settings.leaveUpdates,
        system_updates: settings.systemAnnouncements,
        weekly_reports: settings.weeklyDigest,
        mention_notifications: settings.mentionNotifications,
        // Preferences
        language: settings.language,
        timezone: settings.timezone,
        date_format: settings.dateFormat,
        time_format: settings.timeFormat,
        start_of_week: settings.startOfWeek,
        // Security
        two_factor_auth: settings.twoFactorEnabled,
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

      // Update original settings to reflect saved state
      setOriginalSettings({
        ...settings,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

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

  const discardChanges = () => {
    setSettings(originalSettings);
    setErrors({});
    setToast({ type: "info", message: "Changes discarded" });
  };

  // Account Section
  const renderAccountSection = () => (
    <div className="settings-panel">
      <div className="settings-panel-header">
        <div className="settings-panel-icon">
          <User size={20} />
        </div>
        <div>
          <h2 className="settings-panel-title">Account Settings</h2>
          <p className="settings-panel-description">Manage your personal information and profile</p>
        </div>
      </div>

      <div className="settings-panel-content">
        {/* Avatar Section */}
        <div className="settings-avatar-section">
          <div className="settings-avatar-container">
            <img
              src={settings.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${settings.firstName} ${settings.lastName}`}
              alt="Profile"
              className="settings-avatar-large"
            />
            <button className="settings-avatar-edit" disabled>
              <Camera size={16} />
            </button>
          </div>
          <div className="settings-avatar-info">
            <h3>{settings.firstName} {settings.lastName}</h3>
            <p className="text-muted text-sm">{user?.role}</p>
            <p className="text-muted text-xs mt-1">{settings.email}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="settings-form-row">
          <div className="settings-field">
            <label className="settings-field-label">First Name</label>
            <input
              type="text"
              value={settings.firstName}
              onChange={(e) => updateSetting("firstName", e.target.value)}
              className={`settings-field-input ${errors.firstName ? "error" : ""}`}
              placeholder="Enter first name"
              disabled={isSaving}
            />
            {errors.firstName && (
              <span className="settings-field-error">
                <AlertCircle size={12} /> {errors.firstName}
              </span>
            )}
          </div>

          <div className="settings-field">
            <label className="settings-field-label">Last Name</label>
            <input
              type="text"
              value={settings.lastName}
              onChange={(e) => updateSetting("lastName", e.target.value)}
              className="settings-field-input"
              placeholder="Enter last name"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="settings-field">
          <label className="settings-field-label">Email Address</label>
          <div className="settings-field-with-icon">
            <Mail size={18} className="settings-field-icon" />
            <input
              type="email"
              value={settings.email}
              className="settings-field-input with-icon"
              disabled
            />
          </div>
          <span className="settings-field-hint">Contact administrator to change email</span>
        </div>

        <div className="settings-field">
          <label className="settings-field-label">Phone Number</label>
          <div className="settings-field-with-icon">
            <Smartphone size={18} className="settings-field-icon" />
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => updateSetting("phone", e.target.value)}
              className="settings-field-input with-icon"
              placeholder="+91 12345 67890"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="settings-field">
          <label className="settings-field-label">Bio</label>
          <textarea
            value={settings.bio}
            onChange={(e) => updateSetting("bio", e.target.value)}
            className="settings-field-textarea"
            placeholder="Tell us a little about yourself..."
            rows={3}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );

  // Appearance Section
  const renderAppearanceSection = () => (
    <div className="settings-panel">
      <div className="settings-panel-header">
        <div className="settings-panel-icon">
          <Palette size={20} />
        </div>
        <div>
          <h2 className="settings-panel-title">Appearance</h2>
          <p className="settings-panel-description">Customize how Aurora looks on your device</p>
        </div>
      </div>

      <div className="settings-panel-content">
        {/* Theme Selection */}
        <div className="settings-field">
          <label className="settings-field-label">Theme</label>
          <div className="settings-theme-grid">
            {themeOptions.map((theme) => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.id}
                  className={`settings-theme-option ${settings.theme === theme.id ? "active" : ""}`}
                  onClick={() => updateSetting("theme", theme.id)}
                  disabled={isSaving}
                >
                  <div className="settings-theme-icon">
                    <Icon size={24} />
                  </div>
                  <span className="settings-theme-label">{theme.label}</span>
                  <span className="settings-theme-description">{theme.description}</span>
                  {settings.theme === theme.id && (
                    <div className="settings-theme-check">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <span className="settings-field-hint">Theme switching is coming soon!</span>
        </div>

        {/* Accent Color */}
        <div className="settings-field">
          <label className="settings-field-label">Accent Color</label>
          <div className="settings-color-grid">
            {accentColors.map((color) => (
              <button
                key={color.id}
                className={`settings-color-option ${settings.accentColor === color.id ? "active" : ""}`}
                style={{ "--color": color.color }}
                onClick={() => updateSetting("accentColor", color.id)}
                disabled={isSaving}
                title={color.label}
              >
                {settings.accentColor === color.id && <Check size={14} />}
              </button>
            ))}
          </div>
          <span className="settings-field-hint">Accent color customization is coming soon!</span>
        </div>

        {/* Compact Mode Toggle */}
        <div className="settings-toggle-item">
          <div className="settings-toggle-info">
            <span className="settings-toggle-label">Compact Mode</span>
            <span className="settings-toggle-description">Reduce spacing and use smaller elements</span>
          </div>
          <label className="settings-switch">
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => updateSetting("compactMode", e.target.checked)}
              disabled={isSaving}
            />
            <span className="settings-switch-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  // Notifications Section
  const renderNotificationsSection = () => (
    <div className="settings-panel">
      <div className="settings-panel-header">
        <div className="settings-panel-icon">
          <Bell size={20} />
        </div>
        <div>
          <h2 className="settings-panel-title">Notifications</h2>
          <p className="settings-panel-description">Choose what updates you want to receive</p>
        </div>
      </div>

      <div className="settings-panel-content">
        <div className="settings-notification-group">
          <h3 className="settings-group-title">Delivery Methods</h3>

          <div className="settings-toggle-item">
            <div className="settings-toggle-info">
              <span className="settings-toggle-label">Email Notifications</span>
              <span className="settings-toggle-description">Receive updates via email</span>
            </div>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => updateSetting("emailNotifications", e.target.checked)}
                disabled={isSaving}
              />
              <span className="settings-switch-slider"></span>
            </label>
          </div>

          <div className="settings-toggle-item">
            <div className="settings-toggle-info">
              <span className="settings-toggle-label">Push Notifications</span>
              <span className="settings-toggle-description">Browser and desktop alerts</span>
            </div>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => updateSetting("pushNotifications", e.target.checked)}
                disabled={isSaving}
              />
              <span className="settings-switch-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-notification-group">
          <h3 className="settings-group-title">Notification Types</h3>

          {[
            { key: "taskReminders", label: "Task Reminders", desc: "Alerts for upcoming and overdue tasks" },
            { key: "leaveUpdates", label: "Leave Updates", desc: "Status changes on leave requests" },
            { key: "mentionNotifications", label: "Mentions", desc: "When someone mentions you" },
            { key: "systemAnnouncements", label: "System Announcements", desc: "Important updates and maintenance" },
            { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of your week's activities" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="settings-toggle-item">
              <div className="settings-toggle-info">
                <span className="settings-toggle-label">{label}</span>
                <span className="settings-toggle-description">{desc}</span>
              </div>
              <label className="settings-switch">
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => updateSetting(key, e.target.checked)}
                  disabled={isSaving}
                />
                <span className="settings-switch-slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Preferences Section
  const renderPreferencesSection = () => (
    <div className="settings-panel">
      <div className="settings-panel-header">
        <div className="settings-panel-icon">
          <Globe size={20} />
        </div>
        <div>
          <h2 className="settings-panel-title">Preferences</h2>
          <p className="settings-panel-description">Language, timezone, and regional settings</p>
        </div>
      </div>

      <div className="settings-panel-content">
        <div className="settings-form-row">
          <div className="settings-field">
            <label className="settings-field-label">Language</label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting("language", e.target.value)}
              className="settings-field-select"
              disabled={isSaving}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          <div className="settings-field">
            <label className="settings-field-label">Timezone</label>
            <div className="settings-field-with-icon">
              <Clock size={18} className="settings-field-icon" />
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting("timezone", e.target.value)}
                className="settings-field-select with-icon"
                disabled={isSaving}
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New York (EST)</option>
                <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Europe/Paris">Europe/Paris (CET)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-form-row">
          <div className="settings-field">
            <label className="settings-field-label">Date Format</label>
            <div className="settings-field-with-icon">
              <Calendar size={18} className="settings-field-icon" />
              <select
                value={settings.dateFormat}
                onChange={(e) => updateSetting("dateFormat", e.target.value)}
                className="settings-field-select with-icon"
                disabled={isSaving}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD-MMM-YYYY">DD-MMM-YYYY</option>
              </select>
            </div>
          </div>

          <div className="settings-field">
            <label className="settings-field-label">Time Format</label>
            <select
              value={settings.timeFormat}
              onChange={(e) => updateSetting("timeFormat", e.target.value)}
              className="settings-field-select"
              disabled={isSaving}
            >
              <option value="12h">12 Hour (2:30 PM)</option>
              <option value="24h">24 Hour (14:30)</option>
            </select>
          </div>
        </div>

        <div className="settings-field">
          <label className="settings-field-label">Start of Week</label>
          <select
            value={settings.startOfWeek}
            onChange={(e) => updateSetting("startOfWeek", e.target.value)}
            className="settings-field-select"
            style={{ maxWidth: "300px" }}
            disabled={isSaving}
          >
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
            <option value="saturday">Saturday</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Security Section
  const renderSecuritySection = () => (
    <div className="settings-panel">
      <div className="settings-panel-header">
        <div className="settings-panel-icon">
          <Shield size={20} />
        </div>
        <div>
          <h2 className="settings-panel-title">Security</h2>
          <p className="settings-panel-description">Password, two-factor authentication, and sessions</p>
        </div>
      </div>

      <div className="settings-panel-content">
        {/* Change Password Section */}
        <div className="settings-security-section">
          <div className="settings-security-header">
            <Key size={18} />
            <h3>Change Password</h3>
          </div>

          <div className="settings-field">
            <label className="settings-field-label">New Password</label>
            <div className="settings-field-password">
              <input
                type={showNewPassword ? "text" : "password"}
                value={settings.newPassword}
                onChange={(e) => updateSetting("newPassword", e.target.value)}
                className={`settings-field-input ${errors.newPassword ? "error" : ""}`}
                placeholder="Enter new password"
                disabled={isSaving}
              />
              <button
                type="button"
                className="settings-password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword ? (
              <span className="settings-field-error">
                <AlertCircle size={12} /> {errors.newPassword}
              </span>
            ) : (
              <span className="settings-field-hint">
                Minimum 8 characters with uppercase, lowercase, and number
              </span>
            )}
          </div>

          <div className="settings-field">
            <label className="settings-field-label">Confirm New Password</label>
            <div className="settings-field-password">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={settings.confirmPassword}
                onChange={(e) => updateSetting("confirmPassword", e.target.value)}
                className={`settings-field-input ${errors.confirmPassword ? "error" : ""}`}
                placeholder="Confirm new password"
                disabled={isSaving}
              />
              <button
                type="button"
                className="settings-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="settings-field-error">
                <AlertCircle size={12} /> {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="settings-security-section">
          <div className="settings-toggle-item">
            <div className="settings-toggle-info">
              <span className="settings-toggle-label">Two-Factor Authentication</span>
              <span className="settings-toggle-description">Add an extra layer of security to your account</span>
            </div>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.twoFactorEnabled}
                onChange={(e) => updateSetting("twoFactorEnabled", e.target.checked)}
                disabled={true}
              />
              <span className="settings-switch-slider"></span>
            </label>
          </div>
          <div className="settings-coming-soon">
            <span>🔐 Two-factor authentication is coming soon!</span>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="settings-security-section">
          <div className="settings-security-header">
            <Monitor size={18} />
            <h3>Active Sessions</h3>
          </div>

          <div className="settings-session-item current">
            <div className="settings-session-icon">
              <Monitor size={18} />
            </div>
            <div className="settings-session-info">
              <span className="settings-session-device">Current Session</span>
              <span className="settings-session-details">
                This device • {new Date().toLocaleDateString()}
              </span>
            </div>
            <span className="settings-session-badge">Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    if (isLoading) {
      return (
        <div className="settings-loading">
          <Loader2 size={32} className="animate-spin" />
          <span>Loading settings...</span>
        </div>
      );
    }

    switch (activeSection) {
      case "account":
        return renderAccountSection();
      case "appearance":
        return renderAppearanceSection();
      case "notifications":
        return renderNotificationsSection();
      case "preferences":
        return renderPreferencesSection();
      case "security":
        return renderSecuritySection();
      default:
        return renderAccountSection();
    }
  };

  return (
    <div className="settings-container">
      {/* Page Header */}
      <div className="settings-header">
        <div className="settings-header-content">
          <div className="settings-header-icon">
            <SettingsIcon size={28} />
          </div>
          <div>
            <h1 className="settings-header-title">Settings</h1>
            <p className="settings-header-subtitle">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="settings-layout">
        {/* Sidebar Navigation */}
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`settings-nav-item ${activeSection === item.id ? "active" : ""}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <div className="settings-nav-icon">
                    <Icon size={18} />
                  </div>
                  <div className="settings-nav-content">
                    <span className="settings-nav-label">{item.label}</span>
                    <span className="settings-nav-description">{item.description}</span>
                  </div>
                  <ChevronRight size={16} className="settings-nav-arrow" />
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="settings-sidebar-footer">
            <button
              className="settings-logout-btn"
              onClick={() => authService.signOut()}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="settings-main">
          {renderActiveSection()}

          {/* Save Bar */}
          {hasChanges && (
            <div className="settings-save-bar">
              <span className="settings-save-text">You have unsaved changes</span>
              <div className="settings-save-actions">
                <button
                  className="settings-btn-secondary"
                  onClick={discardChanges}
                  disabled={isSaving}
                >
                  <X size={16} />
                  Discard
                </button>
                <button
                  className="settings-btn-primary"
                  onClick={saveSettings}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </main>
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
