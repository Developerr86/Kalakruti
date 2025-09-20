import React, { useState, useEffect } from 'react';
import Login from './Login';
import Signup from './Signup';
import PlasmaBackground from '../ui/PlasmaBackground';
import './AuthPage.css';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSwitchMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 300);
  };

  const handleAuthSuccess = () => {
    // Add a small delay for better UX
    setTimeout(() => {
      onAuthSuccess && onAuthSuccess();
    }, 500);
  };

  // Prevent scroll on auth page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="auth-page">
      <PlasmaBackground />
      
      <div className="auth-container">
        <div className="auth-content">
          {/* Left Side - Branding */}
          <div className="auth-branding">
            <div className="branding-content">
              <div className="brand-logo">
                <h1 className="brand-name">Kalakruti</h1>
                <span className="brand-tagline">Where Art Meets Soul</span>
              </div>
              
              <div className="brand-features">
                <div className="feature-item">
                  <div className="feature-icon">🎨</div>
                  <div className="feature-text">
                    <h3>Discover Unique Art</h3>
                    <p>Explore handcrafted masterpieces from talented artisans</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">🏛️</div>
                  <div className="feature-text">
                    <h3>Connect with Artists</h3>
                    <p>Meet the creators behind every beautiful piece</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">💎</div>
                  <div className="feature-text">
                    <h3>Curated Collection</h3>
                    <p>Every artwork is carefully selected for quality and authenticity</p>
                  </div>
                </div>
              </div>
              
              <div className="brand-stats">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Artworks</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100+</span>
                  <span className="stat-label">Artists</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Categories</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Authentication Form */}
          <div className="auth-form-section">
            <div className={`auth-form-wrapper ${isAnimating ? 'animating' : ''}`}>
              {isLogin ? (
                <Login 
                  onSwitchToSignup={handleSwitchMode}
                  onSuccess={handleAuthSuccess}
                />
              ) : (
                <Signup 
                  onSwitchToLogin={handleSwitchMode}
                  onSuccess={handleAuthSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="auth-decorations">
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>
      </div>
    </div>
  );
};

export default AuthPage;