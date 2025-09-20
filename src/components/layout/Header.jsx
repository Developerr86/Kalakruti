import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useScrollPosition } from '../../hooks';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [previousNavItem, setPreviousNavItem] = useState('home');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { scrollPosition } = useScrollPosition();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navBgRef = useRef(null);
  const isInitialized = useRef(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setIsMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const navItems = [
    { id: 'home', name: 'Home', path: '/' },
    { id: 'discovery', name: 'Discovery', path: '/discovery' },
    { id: 'my-artworks', name: 'My Artworks', path: '/my-artworks' }
  ];

  const handleNavClick = (itemId, href, path) => {
    setPreviousNavItem(activeNavItem);
    setActiveNavItem(itemId);
    
    // If it's a route path, don't handle scroll here (React Router will handle navigation)
    if (path) {
      return;
    }
    
    // Smooth scroll to section if href exists
    if (href && href.startsWith('#')) {
      setTimeout(() => {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  // Update active nav item based on current route
  useEffect(() => {
    const newActiveItem = location.pathname === '/' ? 'home' : 
                         location.pathname === '/discovery' ? 'discovery' : 
                         location.pathname === '/my-artworks' ? 'my-artworks' : 'home';
    
    if (newActiveItem !== activeNavItem) {
      setPreviousNavItem(activeNavItem);
      setActiveNavItem(newActiveItem);
    }
  }, [location.pathname, activeNavItem]);

  // Dynamic background positioning based on active nav item
  useEffect(() => {
    const updateBackgroundPosition = () => {
      if (navBgRef.current) {
        try {
          const navList = navBgRef.current.parentElement.querySelector('.gooey-nav-list');
          const activeLink = navList?.querySelector('.gooey-nav-link.active');
          const previousLink = navList?.querySelector(`[data-nav-id="${previousNavItem}"]`);
          const logoElement = navList?.querySelector('.logo-item');
          
          if (activeLink && logoElement) {
            const logoRect = logoElement.getBoundingClientRect();
            const activeRect = activeLink.getBoundingClientRect();
            const containerRect = navBgRef.current.parentElement.getBoundingClientRect();
            
            // Calculate target position for active link
            const logoEndX = logoRect.right - containerRect.left;
            const activeStartX = activeRect.left - containerRect.left;
            const targetOffsetX = Math.max(logoEndX + 4, activeStartX - 8);
            const targetWidth = Math.max(80, activeRect.width + 16);
            
            // If we have a previous link and this isn't the initial load
            if (previousLink && previousNavItem !== activeNavItem && isInitialized.current) {
              const previousRect = previousLink.getBoundingClientRect();
              const previousStartX = previousRect.left - containerRect.left;
              const currentOffsetX = Math.max(logoEndX + 4, previousStartX - 8);
              const currentWidth = Math.max(80, previousRect.width + 16);
              
              // Start from previous position
              navBgRef.current.style.transition = 'none';
              navBgRef.current.style.transform = `translateX(${currentOffsetX}px)`;
              navBgRef.current.style.width = `${currentWidth}px`;
              navBgRef.current.style.opacity = '1';
              
              // Force reflow
              navBgRef.current.offsetHeight;
              
              // Animate to new position
              navBgRef.current.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              navBgRef.current.style.transform = `translateX(${targetOffsetX}px)`;
              navBgRef.current.style.width = `${targetWidth}px`;
            } else {
              // Initial load or same item - set position directly
              if (!isInitialized.current) {
                navBgRef.current.style.transition = 'none';
                isInitialized.current = true;
              } else {
                navBgRef.current.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              }
              
              navBgRef.current.style.transform = `translateX(${targetOffsetX}px)`;
              navBgRef.current.style.width = `${targetWidth}px`;
              navBgRef.current.style.opacity = '1';
            }
          } else if (logoElement) {
            // Hide background when no active link
            navBgRef.current.style.opacity = '0.3';
            if (!isInitialized.current) {
              navBgRef.current.style.transform = 'translateX(0px)';
              isInitialized.current = true;
            }
          }
        } catch (error) {
          console.warn('Error updating nav background position:', error);
        }
      }
    };

    // Update position with a delay to ensure DOM updates
    const timeoutId = setTimeout(updateBackgroundPosition, 50);
    
    // Update position on window resize with debouncing
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateBackgroundPosition, 150);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeNavItem, previousNavItem]);

  return (
    <header 
      className={`header ${scrollPosition > 100 ? 'scrolled' : ''}`}
      style={{
        transform: `translateY(${Math.min(scrollPosition * 0.1, 20)}px)`
      }}
    >
      <div className="container">
        <div className="header-content">
          {/* Desktop Navigation with Logo */}
          <nav className="nav-desktop">
            <div className="gooey-nav">
              <div ref={navBgRef} className="gooey-nav-bg"></div>
              <ul className="gooey-nav-list">
                {/* Logo as first item */}
                <li className="gooey-nav-item logo-item">
                  <div className="logo-in-nav">
                    <span className="logo-icon">🎨</span>
                    <span className="logo-text-nav">Kalakruti</span>
                  </div>
                </li>
                {navItems.map((item) => (
                  <li key={item.id} className="gooey-nav-item">
                    <Link 
                      to={item.path}
                      data-nav-id={item.id}
                      className={`gooey-nav-link ${activeNavItem === item.id ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.id, item.href, item.path)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* User Menu & Mobile Menu Toggle */}
          <div className="header-actions">
            {/* User Menu */}
            <div className="user-menu-container">
              <button 
                className="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
              >
                <img 
                  src={user?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616c9044cb2?w=40&h=40&fit=crop&q=80'} 
                  alt={user?.name || 'User'}
                  className="user-avatar"
                />
                <span className="user-name">{user?.name || 'User'}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-info">
                    <img 
                      src={user?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616c9044cb2?w=60&h=60&fit=crop&q=80'} 
                      alt={user?.name || 'User'}
                      className="user-avatar-large"
                    />
                    <div className="user-details">
                      <span className="user-full-name">{user?.name || 'User'}</span>
                      <span className="user-email">{user?.email || 'user@example.com'}</span>
                    </div>
                  </div>
                  <div className="menu-divider"></div>
                  <div className="menu-actions">
                    <button className="menu-action" onClick={() => setShowUserMenu(false)}>
                      <span className="action-icon">⚙️</span>
                      Settings
                    </button>
                    <button className="menu-action" onClick={() => setShowUserMenu(false)}>
                      <span className="action-icon">❤️</span>
                      Favorites
                    </button>
                    <button className="menu-action logout-action" onClick={handleLogout}>
                      <span className="action-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`nav-mobile ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-user-info">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616c9044cb2?w=50&h=50&fit=crop&q=80'} 
              alt={user?.name || 'User'}
              className="mobile-user-avatar"
            />
            <div className="mobile-user-details">
              <span className="mobile-user-name">{user?.name || 'User'}</span>
              <span className="mobile-user-email">{user?.email || 'user@example.com'}</span>
            </div>
          </div>
          <ul className="nav-mobile-list">
            <li className="nav-mobile-item">
              <Link to="/" className="nav-mobile-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-mobile-item">
              <Link to="/discovery" className="nav-mobile-link" onClick={() => setIsMenuOpen(false)}>
                Discovery
              </Link>
            </li>
            <li className="nav-mobile-item">
              <Link to="/my-artworks" className="nav-mobile-link" onClick={() => setIsMenuOpen(false)}>
                My Artworks
              </Link>
            </li>
          </ul>
          <div className="mobile-menu-actions">
            <button className="mobile-menu-action">
              <span className="action-icon">⚙️</span>
              Settings
            </button>
            <button className="mobile-menu-action logout-action" onClick={handleLogout}>
              <span className="action-icon">🚪</span>
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;