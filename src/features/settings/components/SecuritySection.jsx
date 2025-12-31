import React, { useState } from "react";
import PropTypes from "prop-types";
import { Shield, Key, Monitor, Eye, EyeOff, AlertCircle } from "lucide-react";

/**
 * Security Section Component
 * Handles password, 2FA, and session settings
 */
const SecuritySection = ({ settings, errors, isSaving, onUpdateSetting }) => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
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
                                onChange={(e) => onUpdateSetting("newPassword", e.target.value)}
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
                                onChange={(e) => onUpdateSetting("confirmPassword", e.target.value)}
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
                                onChange={(e) => onUpdateSetting("twoFactorEnabled", e.target.checked)}
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
};

SecuritySection.propTypes = {
    settings: PropTypes.shape({
        newPassword: PropTypes.string,
        confirmPassword: PropTypes.string,
        twoFactorEnabled: PropTypes.bool,
    }).isRequired,
    errors: PropTypes.object.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onUpdateSetting: PropTypes.func.isRequired,
};

export default SecuritySection;
