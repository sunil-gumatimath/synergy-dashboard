import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import {
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  X,
  Mail,
} from "lucide-react";
import AuroraLogo from "../components/common/AuroraLogo";
import "../index.css";
import "./login-styles.css";

const LoginPage = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot Password Modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("aurora_remembered_email");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccessMessage("");
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem("aurora_remembered_email");
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!isLogin) {
      if (!formData.name) {
        setError("Please enter your name");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    return true;
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 6) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      if (isLogin) {
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem("aurora_remembered_email", formData.email);
        } else {
          localStorage.removeItem("aurora_remembered_email");
        }

        const { error: signInError } = await signIn(
          formData.email,
          formData.password,
        );
        if (signInError) {
          // Handle specific error cases
          if (signInError.message?.includes('Invalid login credentials')) {
            setError("Invalid email or password. Please try again.");
          } else if (signInError.message?.includes('Email not confirmed')) {
            setError("Please verify your email address before signing in.");
          } else if (signInError.message?.includes('JWT') || signInError.code?.includes('JWT')) {
            setError("Session expired. Please try signing in again.");
          } else {
            setError(signInError.message || "Failed to sign in. Please try again.");
          }
        }
        // Success is handled by AuthContext redirecting to the app
      } else {
        const { error: signUpError } = await signUp(
          formData.email,
          formData.password,
          { full_name: formData.name },
        );
        if (signUpError) {
          // Handle specific signup errors
          if (signUpError.message?.includes('already registered')) {
            setError("This email is already registered. Try signing in instead.");
          } else if (signUpError.message?.includes('Password')) {
            setError("Password is too weak. Use at least 6 characters with numbers and letters.");
          } else {
            setError(signUpError.message || "Failed to create account. Please try again.");
          }
        } else {
          // Show success message and switch to login
          setError("");
          setIsLogin(true);
          setFormData({
            email: formData.email, // Keep email for easy login
            password: "",
            confirmPassword: "",
            name: "",
          });
          // Show success message
          setSuccessMessage("Account created successfully! Please sign in with your credentials.");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("An unexpected error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes("@")) {
      setResetMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setResetLoading(true);
    setResetMessage({ type: "", text: "" });

    try {
      const { error } = await authService.resetPassword(resetEmail);
      if (error) {
        setResetMessage({ type: "error", text: error.message || "Failed to send reset email" });
      } else {
        setResetMessage({
          type: "success",
          text: "Password reset link sent! Check your email inbox.",
        });
        // Clear email after successful send
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetEmail("");
          setResetMessage({ type: "", text: "" });
        }, 3000);
      }
    } catch {
      setResetMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setResetLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccessMessage("");
    setFormData({ email: "", password: "", confirmPassword: "", name: "" });
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  return (
    <div className="login-page">
      {/* Animated Background Elements */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="forgot-password-modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="forgot-password-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setShowForgotPassword(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="modal-icon">
              <Mail size={32} />
            </div>

            <h3 className="modal-title">Reset Password</h3>
            <p className="modal-subtitle">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {resetMessage.text && (
              <div className={`reset-message ${resetMessage.type}`}>
                {resetMessage.type === "error" ? (
                  <AlertCircle size={16} />
                ) : (
                  <Check size={16} />
                )}
                <span>{resetMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="reset-form">
              <div className="form-group">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="form-input"
                  placeholder=" "
                  disabled={resetLoading}
                  autoComplete="email"
                />
                <label className="floating-label">Email Address</label>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <button
              type="button"
              className="back-to-login-btn"
              onClick={() => setShowForgotPassword(false)}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="login-container">
        {/* Logo and Title */}
        <div className="login-header">
          <div className="logo-wrapper">
            <AuroraLogo size={40} className="logo-icon" />
          </div>
          <h1 className="app-title">Aurora</h1>
        </div>

        {/* Form Card */}
        <div className="login-card">
          <div className="card-shine"></div>

          <div className="card-content">
            <div className="form-header">
              <h2 className="form-title">
                {isLogin ? "Welcome Back" : "Get Started"}
              </h2>
              <p className="form-subtitle">
                {isLogin
                  ? "Sign in to access your dashboard"
                  : "Create your account to continue"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-alert">
                <AlertCircle size={18} className="error-icon" />
                <p>{error}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="success-alert">
                <Check size={18} className="success-icon" />
                <p>{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Name (Sign Up only) */}
              {!isLogin && (
                <div className="form-group">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder=" "
                    disabled={loading}
                    autoComplete="name"
                  />
                  <label htmlFor="name" className="floating-label">
                    Full Name
                  </label>
                </div>
              )}

              {/* Email */}
              <div className="form-group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder=" "
                  disabled={loading}
                  autoComplete="email"
                />
                <label htmlFor="email" className="floating-label">
                  Email Address
                </label>
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder=" "
                    disabled={loading}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <label htmlFor="password" className="floating-label">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {!isLogin && formData.password && (
                  <div className="password-strength-meter">
                    <div
                      className="strength-bar"
                      style={{
                        width: `${passwordStrength}%`,
                        backgroundColor:
                          passwordStrength <= 25
                            ? "#ef4444"
                            : passwordStrength <= 50
                              ? "#f59e0b"
                              : passwordStrength <= 75
                                ? "#3b82f6"
                                : "#10b981",
                      }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Confirm Password (Sign Up only) */}
              {!isLogin && (
                <div className="form-group">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder=" "
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <label htmlFor="confirmPassword" className="floating-label">
                    Confirm Password
                  </label>
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              {isLogin && (
                <div className="form-actions">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                    />
                    <span className="checkbox-text">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => {
                      setResetEmail(formData.email);
                      setShowForgotPassword(true);
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <>
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="auth-toggle">
              <p>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="toggle-link"
                  disabled={loading}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="auth-footer">
          © 2025 Aurora. Secure employee management.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
