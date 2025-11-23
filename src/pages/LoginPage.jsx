import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Eye, EyeOff, Briefcase, ArrowRight } from 'lucide-react';
import '../index.css';
import './login-styles.css';

const LoginPage = () => {
    const {signIn, signUp} = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (!isLogin) {
            if (!formData.name) {
                setError('Please enter your name');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                const { error: signInError } = await signIn(formData.email, formData.password);
                if (signInError) {
                    setError(signInError.message || 'Invalid email or password');
                }
            } else {
                const { error: signUpError } = await signUp(
                    formData.email,
                    formData.password,
                    { full_name: formData.name }
                );
                if (signUpError) {
                    setError(signUpError.message || 'Failed to create account');
                } else {
                    setError('');
                    setIsLogin(true);
                    setFormData({ email: '', password: '', confirmPassword: '', name: '' });
                }
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Auth error:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ email: '', password: '', confirmPassword: '', name: '' });
    };

    return (
        <div className="login-page min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob"></div>
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-pink-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl border border-white/20 ring-1 ring-white/10">
                        <Briefcase className="text-white" size={36} />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">Aurora</h1>
                    <p className="text-indigo-200 text-lg font-medium tracking-wide">Employee Management System</p>
                </div>

                {/* Form Card */}
                <div className="login-form-card">
                    {/* Glass Shine Effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {isLogin ? 'Welcome Back' : 'Get Started'}
                            </h2>
                            <p className="text-gray-300">
                                {isLogin ? 'Sign in to access your dashboard' : 'Create your account to continue'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="login-error">
                                <AlertCircle size={20} className="login-error-icon" />
                                <p className="login-error-text">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name (Sign Up only) */}
                            {!isLogin && (
                                <div>
                                    <label htmlFor="name" className="login-label">Full Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="login-input"
                                        placeholder="Enter your full name"
                                        disabled={loading}
                                        autoComplete="name"
                                    />
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="login-label">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="login-input"
                                    placeholder="Enter your email"
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="login-label">Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="login-input"
                                        placeholder="Enter your password"
                                        disabled={loading}
                                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="password-toggle-btn"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password (Sign Up only) */}
                            {!isLogin && (
                                <div>
                                    <label htmlFor="confirmPassword" className="login-label">Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="login-input"
                                        placeholder="Confirm your password"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="login-submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="login-spinner"></div>
                                        <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Toggle Mode */}
                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-sm text-gray-300">
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="login-toggle-link"
                                    disabled={loading}
                                >
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-white/40 mt-8 font-medium">© 2024 Aurora. Secure employee management.</p>
            </div>
        </div>
    );
};

export default LoginPage;
