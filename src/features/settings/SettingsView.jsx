import React, { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { User, Bell, Shield, Palette, Save, Upload } from "lucide-react";

const SettingsView = () => {
  // Profile settings state
  const [profile, setProfile] = useState({
    name: "Tedz",
    email: "tedz@staffly.com",
    bio: "Admin of Staffly employee management system",
    avatar: "https://api.dicebear.com/9.x/micah/svg?seed=Tedz"
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newEmployeeAlerts: true,
    systemUpdates: true,
    weeklyReports: false
  });

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    theme: "light",
    language: "en",
    timezone: "Asia/Kolkata",
    autoBackup: true,
    dataRetention: "3years"
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false
  });

  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(false);

  const sections = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      description: "Manage your personal information and preferences"
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Configure how you receive notifications and updates"
    },
    {
      id: "system",
      label: "System",
      icon: Palette,
      description: "Customize the system appearance and behavior"
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      description: "Update your password and security settings"
    }
  ];

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handleSystemChange = (field, value) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (section) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Here you would typically make API calls to save settings
    console.log(`${section} settings saved`);

    setLoading(false);
    alert(`${section} settings saved successfully!`);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderProfileSection = () => (
    <Card className="max-w-2xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-hover transition-colors">
              <Upload size={14} />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => handleSaveSettings("Profile")} disabled={loading}>
            <Save size={16} />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderNotificationsSection = () => (
    <Card className="max-w-2xl">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1" className="flex-1">
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive email updates about system activities</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={(e) => handleNotificationChange("emailNotifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">Receive browser notifications for important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.pushNotifications}
                onChange={(e) => handleNotificationChange("pushNotifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">New Employee Alerts</h4>
              <p className="text-sm text-gray-600">Get notified when new employees are added</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.newEmployeeAlerts}
                onChange={(e) => handleNotificationChange("newEmployeeAlerts", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">System Updates</h4>
              <p className="text-sm text-gray-600">Receive notifications about system maintenance and updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.systemUpdates}
                onChange={(e) => handleNotificationChange("systemUpdates", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Weekly Reports</h4>
              <p className="text-sm text-gray-600">Get weekly summary reports via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weeklyReports}
                onChange={(e) => handleNotificationChange("weeklyReports", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => handleSaveSettings("Notifications")} disabled={loading}>
            <Save size={16} />
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderSystemSection = () => (
    <Card className="max-w-2xl">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">System Preferences</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={systemSettings.theme}
              onChange={(e) => handleSystemChange("theme", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={systemSettings.language}
              onChange={(e) => handleSystemChange("language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={systemSettings.timezone}
              onChange={(e) => handleSystemChange("timezone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
              <option value="America/New_York">America/New_York (Eastern)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Retention
            </label>
            <select
              value={systemSettings.dataRetention}
              onChange={(e) => handleSystemChange("dataRetention", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="1year">1 Year</option>
              <option value="2years">2 Years</option>
              <option value="3years">3 Years</option>
              <option value="forever">Forever</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Automatic Backups</h4>
            <p className="text-sm text-gray-600">Automatically backup data daily</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={systemSettings.autoBackup}
              onChange={(e) => handleSystemChange("autoBackup", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => handleSaveSettings("System")} disabled={loading}>
            <Save size={16} />
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderSecuritySection = () => (
    <Card className="max-w-2xl">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={securitySettings.currentPassword}
              onChange={(e) => handleSecurityChange("currentPassword", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={securitySettings.newPassword}
              onChange={(e) => handleSecurityChange("newPassword", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={securitySettings.confirmPassword}
              onChange={(e) => handleSecurityChange("confirmPassword", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            {securitySettings.twoFactorAuth && (
              <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Enabled
              </span>
            )}
          </div>
          <Button
            variant={securitySettings.twoFactorAuth ? "ghost" : "primary"}
            className={securitySettings.twoFactorAuth ? "btn-danger-ghost" : ""}
            onClick={() => {
              setSecuritySettings(prev => ({
                ...prev,
                twoFactorAuth: !prev.twoFactorAuth
              }));
              alert(securitySettings.twoFactorAuth ? "2FA disabled" : "2FA setup initiated");
            }}
          >
            {securitySettings.twoFactorAuth ? "Disable" : "Enable"}
          </Button>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => {
            setSecuritySettings({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
              twoFactorAuth: securitySettings.twoFactorAuth
            });
          }}>
            Cancel
          </Button>
          <Button onClick={() => handleSaveSettings("Security")} disabled={loading}>
            <Save size={16} />
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSection();
      case "notifications":
        return renderNotificationsSection();
      case "system":
        return renderSystemSection();
      case "security":
        return renderSecuritySection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Settings Navigation */}
      <div className="w-full lg:w-80">
        <Card className="sticky top-6">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? "bg-primary/5 text-primary border-l-4 border-primary"
                      : "hover:bg-gray-50 text-gray-700 border-l-4 border-transparent"
                  }`}
                >
                  <Icon size={20} className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{section.label}</div>
                    <div className="text-sm text-gray-500 leading-tight mt-0.5 opacity-75">
                      {section.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </Card>
      </div>

      {/* Settings Content */}
      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsView;
