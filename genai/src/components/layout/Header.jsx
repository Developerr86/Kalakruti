import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollPosition } from '../../hooks';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('home');
  const { scrollPosition } = useScrollPosition();
  const location = useLocation();
  const navBgRef = useRef(null);

  const navItems = [
    { id: 'home', name: 'Home', path: '/' },
    { id: 'discovery', name: 'Discovery', path: '/discovery' },
    { id: 'my-artworks', name: 'My Artworks', path: '/my-artworks' }
  ];

  const handleNavClick = (itemId, href, path) => {
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
    if (location.pathname === '/') {
      setActiveNavItem('home');
    } else if (location.pathname === '/discovery') {
      setActiveNavItem('discovery');
    } else if (location.pathname === '/my-artworks') {
      setActiveNavItem('my-artworks');
    }
  }, [location.pathname]);

  // Dynamic background positioning based on active nav item
  useEffect(() => {
    const updateBackgroundPosition = () => {
      if (navBgRef.current) {
        try {
          const navList = navBgRef.current.parentElement.querySelector('.gooey-nav-list');
          const activeLink = navList?.querySelector('.gooey-nav-link.active');
          
          if (activeLink) {
            const linkRect = activeLink.getBoundingClientRect();
            const containerRect = navBgRef.current.parentElement.getBoundingClientRect();
            
            // Calculate proper offset accounting for logo
            const logoElement = navList?.querySelector('.logo-item');
            const logoWidth = logoElement ? logoElement.offsetWidth + 16 : 120; // Add margin
            const offsetX = Math.max(logoWidth, linkRect.left - containerRect.left - 8);
            const width = Math.max(80, linkRect.width + 16); // Add padding
            
            navBgRef.current.style.transform = `translateX(${offsetX}px)`;
            navBgRef.current.style.width = `${width}px`;
          } else {
            // Default position when no active link
            const logoElement = navList?.querySelector('.logo-item');
            const logoWidth = logoElement ? logoElement.offsetWidth + 16 : 120;
            navBgRef.current.style.transform = `translateX(${logoWidth}px)`;
            navBgRef.current.style.width = '80px';
          }
        } catch (error) {
          console.warn('Error updating nav background position:', error);
        }
      }
    };

    // Update position immediately with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateBackgroundPosition, 50);
    
    // Update position on window resize
    window.addEventListener('resize', updateBackgroundPosition);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateBackgroundPosition);
    };
  }, [activeNavItem]);

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

          {/* Mobile Menu Toggle */}
          <div className="header-actions">
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
        </nav>
      </div>
    </header>
  );
};

export default Header;