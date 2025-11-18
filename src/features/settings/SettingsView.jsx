import React, { useState } from 'react';
import {
  User, Bell, Globe, Moon, Shield,
  Camera, LogOut, Sun, Laptop, ChevronRight, Mail, Lock, Smartphone, Check,
  AlertCircle, Key, Download, Trash2, Clock, MapPin, Activity
} from 'lucide-react';
import Toast from '../../components/Toast';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import ConfirmModal from '../../components/ConfirmModal';
import ProfileCompletionBar from '../../components/ProfileCompletionBar';

const SettingsView = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    fullName: 'Tedz Admin',
    email: 'tedz@staffly.com',
    phone: '+1 (555) 123-4567',
    bio: 'Senior Administrator managing the engineering department resources and timelines.',
    role: 'Administrator',
    emailVerified: true,
    lastLogin: '2 hours ago',
    memberSince: 'January 2024'
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New employee registration", desc: "Receive alerts when a new employee joins the company", checked: true, category: 'critical' },
    { id: 2, title: "Leave requests", desc: "Get notified immediately when an employee requests time off", checked: true, category: 'critical' },
    { id: 3, title: "Performance reviews", desc: "Reminders for upcoming performance reviews and deadlines", checked: true, category: 'updates' },
    { id: 4, title: "System updates", desc: "Important updates about the Staffly platform features", checked: false, category: 'updates' },
    { id: 5, title: "Weekly Analytics Report", desc: "Receive a summary of weekly performance metrics", checked: false, category: 'reports' },
    { id: 6, title: "Marketing emails", desc: "Tips, feature announcements, and product news", checked: false, category: 'marketing' }
  ]);

  // Security State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'New York, US', lastActive: 'Active now', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'New York, US', lastActive: '2 hours ago', current: false },
    { id: 3, device: 'Firefox on MacOS', location: 'New York, US', lastActive: '1 day ago', current: false }
  ]);

  // Preferences State
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC-5',
    emailFrequency: 'instant'
  });

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
    return re.test(phone.replace(/\s/g, ''));
  };

  const handleSave = async () => {
    // Validate
    const newErrors = {};
    if (!profile.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!validateEmail(profile.email)) newErrors.email = 'Invalid email address';
    if (profile.phone && !validatePhone(profile.phone)) newErrors.phone = 'Invalid phone number';
    if (profile.bio.length > 240) newErrors.bio = 'Bio must be under 240 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ message: 'Please fix the errors before saving', type: 'error' });
      return;
    }

    setErrors({});
    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSaving(false);
    setToast({ message: 'Profile updated successfully!', type: 'success' });
  };

  const handlePasswordUpdate = async () => {
    const newErrors = {};

    if (!passwords.current) newErrors.current = 'Current password is required';
    if (!passwords.new) newErrors.new = 'New password is required';
    if (passwords.new.length < 8) newErrors.new = 'Password must be at least 8 characters';
    if (passwords.new !== passwords.confirm) newErrors.confirm = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ message: 'Please fix the password errors', type: 'error' });
      return;
    }

    setIsUpdatingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setPasswords({ current: '', new: '', confirm: '' });
    setIsUpdatingPassword(false);
    setToast({ message: 'Password updated successfully!', type: 'success' });
  };

  const handleSignOut = () => {
    setShowSignOutModal(true);
  };

  const confirmSignOut = () => {
    console.log('Signing out...');
    setToast({ message: 'Signed out successfully', type: 'success' });
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    console.log('Deleting account...');
    setToast({ message: 'Account deletion initiated', type: 'info' });
  };

  const handleRevokeSession = (sessionId) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    setToast({ message: 'Session revoked successfully', type: 'success' });
  };

  const handleExportData = async () => {
    setToast({ message: 'Preparing your data export...', type: 'info' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    setToast({ message: 'Data export ready for download!', type: 'success' });
  };

  const toggleAllNotifications = (enable) => {
    setNotifications(notifications.map(n => ({ ...n, checked: enable })));
    setToast({
      message: enable ? 'All notifications enabled' : 'All notifications disabled',
      type: 'success'
    });
  };

  const sections = [
    { id: 'profile', label: 'My Profile', icon: User, description: 'Manage your personal info' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Configure email alerts' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password & authentication' },
    { id: 'preferences', label: 'Preferences', icon: Globe, description: 'Language & appearance' },
  ];

  const renderProfileSection = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Completion */}
      <ProfileCompletionBar profile={profile} />

      {/* Account Info */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-slate-200 rounded-none p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-slate-400" />
            <span className="text-slate-600">Last login:</span>
            <span className="font-semibold text-slate-900">{profile.lastLogin}</span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2 text-sm">
            <Activity size={16} className="text-slate-400" />
            <span className="text-slate-600">Member since:</span>
            <span className="font-semibold text-slate-900">{profile.memberSince}</span>
          </div>
        </div>
        {profile.emailVerified && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-none">
            <Check size={14} />
            <span className="text-xs font-semibold">Email Verified</span>
          </div>
        )}
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start pb-8 border-b border-slate-200">
        <div className="relative group shrink-0">
          <div className="w-28 h-28 rounded-full bg-slate-100 border border-slate-200 shadow-sm overflow-hidden ring-2 ring-indigo-50 group-hover:ring-indigo-200 transition">
            <img
              src="https://api.dicebear.com/9.x/micah/svg?seed=Tedz"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:translate-x-0.5 hover:-translate-y-0.5 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white">
            <Camera size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Profile picture</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Upload a professional photo. This will be displayed on your profile and visible to other employees.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-none hover:bg-slate-50 transition-colors">
              Remove
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-none hover:bg-indigo-700 transition-colors">
              Upload new
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full name</label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => {
                setProfile({ ...profile, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: null });
              }}
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-none text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none placeholder:text-slate-400 ${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200'
                }`}
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.fullName}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email address</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => {
                setProfile({ ...profile, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-none text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none placeholder:text-slate-400 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200'
                }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone number</label>
          <div className="relative group">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => {
                setProfile({ ...profile, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-none text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none placeholder:text-slate-400 ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200'
                }`}
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={profile.role}
              disabled
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-sm text-slate-500 cursor-not-allowed font-medium"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bio</label>
          <textarea
            rows="4"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-none text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none resize-none placeholder:text-slate-400"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Brief description for your profile.</span>
            <span className={`text-xs font-medium ${profile.bio.length > 200 ? 'text-amber-600' : 'text-slate-500'}`}>
              {240 - profile.bio.length} characters left
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => {
    const groupedNotifications = {
      critical: notifications.filter(n => n.category === 'critical'),
      updates: notifications.filter(n => n.category === 'updates'),
      reports: notifications.filter(n => n.category === 'reports'),
      marketing: notifications.filter(n => n.category === 'marketing')
    };

    const allEnabled = notifications.every(n => n.checked);
    const allDisabled = notifications.every(n => !n.checked);

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-none p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-indigo-100">
                <Bell className="text-indigo-600 shrink-0" size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-indigo-900">Email notifications</h4>
                <p className="text-sm text-indigo-700 mt-1 leading-relaxed">
                  Choose what you want to be notified about. You can always change these settings later.
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => toggleAllNotifications(true)}
                disabled={allEnabled}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-none hover:bg-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enable all
              </button>
              <button
                onClick={() => toggleAllNotifications(false)}
                disabled={allDisabled}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-none hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Disable all
              </button>
            </div>
          </div>
        </div>

        {/* Email Frequency */}
        <div className="bg-white border border-slate-200 rounded-none p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Email frequency</h4>
              <p className="text-sm text-slate-500 mt-0.5">Choose how often you receive email notifications</p>
            </div>
            <select
              value={preferences.emailFrequency}
              onChange={(e) => {
                setPreferences({ ...preferences, emailFrequency: e.target.value });
                setToast({ message: 'Email frequency updated', type: 'success' });
              }}
              className="px-4 py-2 bg-white border border-slate-200 rounded-none text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none cursor-pointer"
            >
              <option value="instant">Instantly</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly digest</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`group flex items-start gap-4 p-4 rounded-none border transition-all duration-200 ${item.checked
                  ? 'bg-white border-indigo-100 shadow-sm shadow-indigo-50'
                  : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
            >
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-semibold transition-colors ${item.checked ? 'text-slate-900' : 'text-slate-800'
                    }`}
                >
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
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
                {/* Rounded toggle */}
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 relative transition-colors">
                  <span className="absolute top-[2px] left-[2px] h-5 w-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSecuritySection = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-none border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-none shrink-0">
            <Key size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900">Password settings</h3>
            <p className="text-sm text-slate-500 mt-0.5">Update your password to keep your account secure.</p>
            <p className="text-xs text-slate-400 mt-2">Last changed: 30 days ago</p>
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => {
                  setPasswords({ ...passwords, current: e.target.value });
                  if (errors.current) setErrors({ ...errors, current: null });
                }}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-none text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none ${errors.current ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200'
                  }`}
                placeholder="••••••••"
              />
              {errors.current && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.current}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">New password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => {
                  setPasswords({ ...passwords, new: e.target.value });
                  if (errors.new) setErrors({ ...errors, new: null });
                }}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-none text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none ${errors.new ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200'
                  }`}
                placeholder="••••••••"
              />
              {errors.new && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.new}
                </p>
              )}
            </div>
            <PasswordStrengthIndicator password={passwords.new} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confirm new password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => {
                  setPasswords({ ...passwords, confirm: e.target.value });
                  if (errors.confirm) setErrors({ ...errors, confirm: null });
                }}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-none text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none ${errors.confirm ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200'
                  }`}
                placeholder="••••••••"
              />
              {errors.confirm && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.confirm}
                </p>
              )}
              {passwords.confirm && passwords.new === passwords.confirm && (
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <Check size={12} />
                  Passwords match
                </p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handlePasswordUpdate}
              disabled={isUpdatingPassword || !passwords.current || !passwords.new || !passwords.confirm}
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-none hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUpdatingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                'Update password'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-none border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-none shrink-0">
            <Activity size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900">Active sessions</h3>
            <p className="text-sm text-slate-500 mt-0.5">Manage devices where you're currently logged in</p>
          </div>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-none border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-none border border-slate-200">
                  <Laptop size={18} className="text-slate-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900">{session.device}</h4>
                    {session.current && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-none">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <MapPin size={12} />
                    <span>{session.location}</span>
                    <span>•</span>
                    <span>{session.lastActive}</span>
                  </div>
                </div>
              </div>
              {!session.current && (
                <button
                  onClick={() => handleRevokeSession(session.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-none transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-800 rounded-none p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-white/10 rounded-none shrink-0">
              <Shield className="text-indigo-300" size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-semibold">Two-factor authentication</h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                Add an extra layer of security to your account by enabling 2FA verification.
              </p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-none hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0">
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-none border-2 border-red-200 p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-4 pb-4 border-b border-red-100">
          <div className="p-2.5 bg-red-50 text-red-600 rounded-none shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-red-900">Danger zone</h3>
            <p className="text-sm text-red-700 mt-0.5">Irreversible and destructive actions</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4 p-4 bg-red-50/50 rounded-none border border-red-100">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Export account data</h4>
              <p className="text-sm text-slate-600 mt-1">Download a copy of your personal data and activity</p>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-none hover:bg-slate-50 transition-colors shrink-0 flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
          </div>

          <div className="flex items-start justify-between gap-4 p-4 bg-red-50 rounded-none border border-red-200">
            <div>
              <h4 className="text-sm font-semibold text-red-900">Delete account</h4>
              <p className="text-sm text-red-700 mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-none hover:bg-red-700 transition-colors shrink-0 flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-10 animate-fade-in">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Appearance</h3>
          <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-none uppercase tracking-wide">
            Visuals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['light', 'dark', 'system'].map((theme) => (
            <button
              key={theme}
              onClick={() => setPreferences({ ...preferences, theme })}
              className={`relative p-5 rounded-none border text-left transition-all duration-200 group ${preferences.theme === theme
                  ? 'border-indigo-500/80 bg-indigo-50/60 shadow-sm shadow-indigo-100'
                  : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                }`}
            >
              <div
                className={`mb-4 ${preferences.theme === theme ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'
                  }`}
              >
                {theme === 'light' && <Sun size={28} strokeWidth={1.5} />}
                {theme === 'dark' && <Moon size={28} strokeWidth={1.5} />}
                {theme === 'system' && <Laptop size={28} strokeWidth={1.5} />}
              </div>
              <p
                className={`font-semibold capitalize text-sm ${preferences.theme === theme ? 'text-slate-900' : 'text-slate-900'
                  }`}
              >
                {theme} mode
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {theme === 'system' ? 'Follows system settings' : `Always use ${theme} theme`}
              </p>
              {preferences.theme === theme && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-indigo-600 font-medium">
                  <Check size={14} />
                  Selected
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-200" />

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">Regional settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Language</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-none text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none cursor-pointer appearance-none"
              >
                <option value="en">English (United States)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={16} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Timezone</label>
            <div className="relative">
              <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-none text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none cursor-pointer appearance-none"
              >
                <option value="UTC-5">Eastern Time (US & Canada)</option>
                <option value="UTC-8">Pacific Time (US & Canada)</option>
                <option value="UTC+0">UTC</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const activeSectionMeta = sections.find(section => section.id === activeSection);

  return (
    <>
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={confirmSignOut}
        title="Sign out"
        message="Are you sure you want to sign out? You'll need to sign in again to access your account."
        confirmText="Sign out"
        type="warning"
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAccount}
        title="Delete account"
        message="This will permanently delete your account and all associated data. This action cannot be undone. Are you absolutely sure?"
        confirmText="Delete my account"
        type="danger"
      />

      <div className="min-h-screen bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
              <p className="text-slate-500 mt-1.5 text-sm">
                Manage your account settings and preferences.
              </p>
            </div>
            {activeSection === 'profile' && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-none transition-all shadow-sm hover:shadow-md disabled:opacity-80 disabled:cursor-default ${isSaving
                    ? 'bg-emerald-600'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
              >
                {isSaving ? (
                  <>
                    <Check size={18} />
                    Saved
                  </>
                ) : (
                  'Save changes'
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
            {/* Sidebar Navigation */}
            <nav className="flex flex-col bg-white border border-slate-200 rounded-none shadow-sm sticky top-4">
              <div className="p-2 space-y-1 overflow-y-auto max-h-[70vh]">
                {sections.map(section => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      type="button"
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-none text-left transition-all duration-200 ${isActive
                          ? 'bg-indigo-50 text-indigo-900'
                          : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      <div
                        className={`p-2 rounded-none border text-slate-500 bg-white ${isActive
                            ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                            : 'border-slate-200 group-hover:border-slate-300'
                          }`}
                      >
                        <Icon size={18} className="shrink-0" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block font-medium text-sm truncate">{section.label}</span>
                        <span className="block text-xs text-slate-400 truncate">
                          {section.description}
                        </span>
                      </div>
                      {isActive && (
                        <ChevronRight size={16} className="shrink-0 text-indigo-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-1 pt-2 border-t border-slate-100 px-3 pb-3 bg-slate-50/60">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-none transition-colors"
                >
                  <span className="p-2 rounded-none bg-red-50 text-red-600">
                    <LogOut size={16} className="shrink-0" />
                  </span>
                  Sign out
                </button>
              </div>
            </nav>

            {/* Main Content Area */}
            <div className="bg-white border border-slate-200 rounded-none shadow-sm flex flex-col">
              <div className="px-6 py-5 sm:px-8 border-b border-slate-100 bg-slate-50/60">
                <h2 className="text-xl font-semibold text-slate-900">
                  {activeSectionMeta?.label}
                </h2>
                <p className="text-slate-500 mt-1 text-sm">
                  {activeSectionMeta?.description}
                </p>
              </div>

              <div className="px-6 py-6 sm:p-8 flex-1 overflow-auto">
                {activeSection === 'profile'
                  ? renderProfileSection()
                  : activeSection === 'notifications'
                    ? renderNotificationsSection()
                    : activeSection === 'security'
                      ? renderSecuritySection()
                      : renderPreferencesSection()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsView;
