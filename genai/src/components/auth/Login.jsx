import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ onSwitchToSignup, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      onSuccess && onSuccess();
    } catch (error) {
      // Error is handled by AuthContext
      console.log('Login error:', error.message);
    }
  };

  const handleDemoLogin = async () => {
    // Pre-fill with demo credentials
    const demoCredentials = {
      email: 'demo@kalakruti.com',
      password: 'demo123'
    };

    // Create demo user if it doesn't exist
    const users = JSON.parse(localStorage.getItem('artUsers') || '[]');
    const demoUser = users.find(u => u.email === demoCredentials.email);
    
    if (!demoUser) {
      const newDemoUser = {
        id: 'demo-user',
        name: 'Demo User',
        email: demoCredentials.email,
        password: demoCredentials.password,
        joinDate: new Date().toISOString(),
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
        preferences: {
          theme: 'light',
          notifications: true,
          newsletter: false
        }
      };
      users.push(newDemoUser);
      localStorage.setItem('artUsers', JSON.stringify(users));
    }

    setFormData(demoCredentials);
    
    try {
      await login(demoCredentials.email, demoCredentials.password);
      onSuccess && onSuccess();
    } catch (error) {
      console.log('Demo login error:', error.message);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-header">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your Kalakruti account</p>
      </div>

      {error && (
        <div className="auth-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              autoComplete="email"
            />
            <span className="input-icon">📧</span>
          </div>
          {errors.email && (
            <span className="field-error">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </div>

        <div className="form-options">
          <label className="checkbox-wrapper">
            <input type="checkbox" className="checkbox" />
            <span className="checkbox-label">Remember me</span>
          </label>
          <button type="button" className="forgot-password">
            Forgot password?
          </button>
        </div>

        <button 
          type="submit" 
          className={`auth-submit ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="demo-login-btn"
          disabled={loading}
        >
          🎨 Try Demo Account
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={onSwitchToSignup}
            className="switch-auth"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;