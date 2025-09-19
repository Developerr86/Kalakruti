import React, { useState, useEffect, useRef } from 'react';
import { useScrollPosition } from '../../hooks';
import './Header.css';

const Header = ({ onSearch, onCategorySelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('home');
  const { scrollPosition } = useScrollPosition();
  const navBgRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'paintings', name: 'Paintings' },
    { id: 'pottery', name: 'Pottery' },
    { id: 'sculptures', name: 'Sculptures' },
    { id: 'handicrafts', name: 'Handicrafts' }
  ];

  const navItems = [
    { id: 'home', name: 'Home', href: '#home' },
    { id: 'collections', name: 'Collections', href: '#collections', hasDropdown: true },
    { id: 'artists', name: 'Artists', href: '#artists' },
    { id: 'gallery', name: 'Gallery', href: '#gallery' },
    { id: 'about', name: 'About', href: '#about' },
    { id: 'contact', name: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (itemId, href) => {
    setActiveNavItem(itemId);
    
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
            
            const offsetX = Math.max(0, linkRect.left - containerRect.left - 8); // 8px padding
            const width = Math.max(80, linkRect.width); // Minimum width
            
            navBgRef.current.style.transform = `translateX(${offsetX}px)`;
            navBgRef.current.style.width = `${width}px`;
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
        transform: `translateY(${Math.min(scrollPosition * 0.1, 20)}px)`,
        backdropFilter: scrollPosition > 50 ? 'blur(10px)' : 'none'
      }}
    >
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <h1 className="logo-text">
              <span className="logo-icon">🎨</span>
              Kalakruti
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <div className="gooey-nav">
              <div ref={navBgRef} className="gooey-nav-bg"></div>
              <ul className="gooey-nav-list">
                {navItems.map((item) => (
                  <li key={item.id} className="gooey-nav-item">
                    {item.hasDropdown ? (
                      <div className="gooey-dropdown">
                        <button 
                          className={`gooey-nav-link ${activeNavItem === item.id ? 'active' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.id, item.href);
                          }}
                        >
                          {item.name}
                          <span className="dropdown-arrow">▼</span>
                        </button>
                        <div className="gooey-dropdown-menu">
                          {categories.map(category => (
                            <button
                              key={category.id}
                              className="gooey-dropdown-item"
                              onClick={() => onCategorySelect && onCategorySelect(category.id)}
                            >
                              {category.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <a 
                        href={item.href} 
                        className={`gooey-nav-link ${activeNavItem === item.id ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.id, item.href);
                        }}
                      >
                        {item.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Search Bar */}
          <div className="search-container">
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search artworks, artists..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button type="submit" className="search-button">
                  <span className="search-icon">🔍</span>
                </button>
              </div>
            </form>
          </div>

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
              <a href="#home" className="nav-mobile-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </a>
            </li>
            <li className="nav-mobile-item">
              <div className="nav-mobile-category">
                <span className="nav-mobile-label">Collections</span>
                <div className="nav-mobile-dropdown">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className="nav-mobile-dropdown-item"
                      onClick={() => {
                        onCategorySelect && onCategorySelect(category.id);
                        setIsMenuOpen(false);
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </li>
            <li className="nav-mobile-item">
              <a href="#artists" className="nav-mobile-link" onClick={() => setIsMenuOpen(false)}>
                Artists
              </a>
            </li>
            <li className="nav-mobile-item">
              <a href="#gallery" className="nav-mobile-link" onClick={() => setIsMenuOpen(false)}>
                Gallery
              </a>
            </li>
            <li className="nav-mobile-item">
              <a href="#about" className="nav-mobile-link" onClick={() => setIsMenuOpen(false)}>
                About
              </a>
            </li>
            <li className="nav-mobile-item">
              <a href="#contact" className="nav-mobile-link" onClick={() => setIsMenuOpen(false)}>
                Contact
              </a>
            </li>
          </ul>

          {/* Mobile Search */}
          <div className="mobile-search">
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search artworks, artists..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button type="submit" className="search-button">
                  <span className="search-icon">🔍</span>
                </button>
              </div>
            </form>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;