import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Hero from './components/layout/Hero';
import ProductGallery from './components/product/ProductGallery';
import { useDebounce, useMultiLayerParallax, useFloatingAnimation } from './hooks';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showArtworkModal, setShowArtworkModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const { getParallaxStyle } = useMultiLayerParallax();
  const [floatingElement1] = useFloatingAnimation(0.2, 0.3);
  const [floatingElement2] = useFloatingAnimation(0.3, 0.5);
  const [floatingElement3] = useFloatingAnimation(0.15, 0.7);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Handle category changes from header or gallery
  useEffect(() => {
    const handleCategoryChange = (event) => {
      setSelectedCategory(event.detail);
      // Scroll to gallery section
      const galleryElement = document.getElementById('gallery');
      if (galleryElement) {
        galleryElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const handleClearSearch = () => {
      setSearchQuery('');
    };

    window.addEventListener('categoryChange', handleCategoryChange);
    window.addEventListener('clearSearch', handleClearSearch);

    return () => {
      window.removeEventListener('categoryChange', handleCategoryChange);
      window.removeEventListener('clearSearch', handleClearSearch);
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // If there's a search query, scroll to gallery
    if (query.trim()) {
      setTimeout(() => {
        const galleryElement = document.getElementById('gallery');
        if (galleryElement) {
          galleryElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleViewDetails = (artwork) => {
    setSelectedArtwork(artwork);
    setShowArtworkModal(true);
  };

  const handleCloseArtworkModal = () => {
    setShowArtworkModal(false);
    setSelectedArtwork(null);
  };

  const handleExploreClick = () => {
    const galleryElement = document.getElementById('gallery');
    if (galleryElement) {
      galleryElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewArtist = (artistId) => {
    // In a real app, this would navigate to artist profile
    console.log('View artist:', artistId);
    alert('Artist profile feature coming soon!');
  };

  return (
    <div className="App">
      {/* Enhanced global parallax background elements */}
      <div className="app-parallax-bg">
        <div 
          ref={floatingElement1}
          className="global-parallax-element global-element-1 premium-global-element"
          style={getParallaxStyle(-0.8, 'translateY')}
        ></div>
        <div 
          ref={floatingElement2}
          className="global-parallax-element global-element-2 premium-global-element"
          style={getParallaxStyle(0.6, 'translateY')}
        ></div>
        <div 
          ref={floatingElement3}
          className="global-parallax-element global-element-3 premium-global-element"
          style={getParallaxStyle(-0.4, 'rotate')}
        ></div>
        
        {/* Additional ambient elements */}
        <div className="ambient-glow ambient-glow-1"></div>
        <div className="ambient-glow ambient-glow-2"></div>
        <div className="ambient-particles">
          <div className="ambient-particle" style={{animationDelay: '0s'}}></div>
          <div className="ambient-particle" style={{animationDelay: '2s'}}></div>
          <div className="ambient-particle" style={{animationDelay: '4s'}}></div>
          <div className="ambient-particle" style={{animationDelay: '6s'}}></div>
        </div>
      </div>
      
      {/* Header */}
      <Header
        onSearch={handleSearch}
        onCategorySelect={setSelectedCategory}
      />
      
      {/* Hero Section */}
      <Hero
        onExploreClick={handleExploreClick}
        onViewArtistClick={handleViewArtist}
      />
      
      {/* Artwork Gallery */}
      <ProductGallery
        searchQuery={debouncedSearchQuery}
        selectedCategory={selectedCategory}
        onQuickView={handleViewDetails}
        onAddToCart={() => {}} // Removed functionality
      />
      
      {/* Artwork Details Modal */}
      {showArtworkModal && selectedArtwork && (
        <div className="artwork-modal-overlay" onClick={handleCloseArtworkModal}>
          <div className="artwork-modal" onClick={(e) => e.stopPropagation()}>
            <div className="artwork-modal-content">
              <button className="artwork-modal-close" onClick={handleCloseArtworkModal}>
                ×
              </button>
              
              <div className="artwork-modal-image">
                <img src={selectedArtwork.image} alt={selectedArtwork.title} />
              </div>
              
              <div className="artwork-modal-details">
                <div className="artwork-modal-header">
                  <h2 className="artwork-modal-title">{selectedArtwork.title}</h2>
                  <p className="artwork-modal-artist" onClick={() => handleViewArtist(selectedArtwork.artist)}>
                    by {selectedArtwork.artistName}
                  </p>
                </div>
                
                <div className="artwork-modal-info">
                  <div className="artwork-modal-description">
                    <h3>About this artwork</h3>
                    <p>{selectedArtwork.description}</p>
                  </div>
                  
                  <div className="artwork-modal-specifications">
                    <h3>Specifications</h3>
                    <div className="spec-grid">
                      <div className="spec-item">
                        <span className="spec-label">Medium:</span>
                        <span className="spec-value">{selectedArtwork.materials}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Dimensions:</span>
                        <span className="spec-value">{selectedArtwork.dimensions}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Year Created:</span>
                        <span className="spec-value">{selectedArtwork.yearCreated}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Collection:</span>
                        <span className="spec-value">{selectedArtwork.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="artwork-modal-tags">
                    <h3>Tags</h3>
                    <div className="tags-list">
                      {selectedArtwork.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="artwork-modal-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => handleViewArtist(selectedArtwork.artist)}
                  >
                    View Artist Profile
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      // In a real app, this could show contact form for inquiries
                      alert('Contact artist feature coming soon!');
                    }}
                  >
                    Contact Artist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
