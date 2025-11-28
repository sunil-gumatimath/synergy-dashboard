import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Briefcase,
  ArrowRight,
  Check,
  Github,
  Chrome,
} from "lucide-react";
import "../index.css";
import "./login-styles.css";

const LoginPage = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
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
    try {
      if (isLogin) {
        const { error: signInError } = await signIn(
          formData.email,
          formData.password,
        );
        if (signInError) {
          setError(signInError.message || "Invalid email or password");
        }
      } else {
        const { error: signUpError } = await signUp(
          formData.email,
          formData.password,
          { full_name: formData.name },
        );
        if (signUpError) {
          setError(signUpError.message || "Failed to create account");
        } else {
          setError("");
          setIsLogin(true);
          setFormData({
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
          });
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
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

      {/* Main Content */}
      <div className="login-container">
        {/* Logo and Title */}
        <div className="login-header">
          <div className="logo-wrapper">
            <Briefcase className="logo-icon" size={32} />
          </div>
          <h1 className="app-title">Aurora</h1>
          <p className="app-subtitle">Employee Management System</p>
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
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Remember me</span>
                  </label>
                  <a href="#" className="forgot-password-link">
                    Forgot Password?
                  </a>
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

              {/* Social Login */}
              <div className="social-login">
                <div className="divider">
                  <span>Or continue with</span>
                </div>
                <div className="social-buttons">
                  <button type="button" className="social-btn">
                    <Chrome size={18} />
                  </button>
                  <button type="button" className="social-btn">
                    <Github size={18} />
                  </button>
                </div>
              </div>
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
