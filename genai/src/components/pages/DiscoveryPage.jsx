import React, { useState, useEffect } from 'react';
import { artworks, categories, getFeaturedArtworks } from '../../data/mockData';
import { useScrollAnimation, useParallax, useDebounce } from '../../hooks';
import Header from '../layout/Header';
import ProductCard from '../product/ProductCard';
import './Discovery.css';

const DiscoveryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArtworks, setFilteredArtworks] = useState(artworks);
  const [showArtworkModal, setShowArtworkModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(0.3, true);
  const [filtersRef, filtersVisible] = useScrollAnimation(0.3, true);
  const [galleryRef, galleryVisible] = useScrollAnimation(0.2, true);
  const [heroParallaxRef, heroParallaxOffset] = useParallax(0.3, 'vertical');

  // Filter and search logic
  useEffect(() => {
    let filtered = [...artworks];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(artwork => artwork.category === selectedCategory);
    }

    // Search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(query) ||
        artwork.artistName.toLowerCase().includes(query) ||
        artwork.description.toLowerCase().includes(query) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort artworks
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.yearCreated - a.yearCreated);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredArtworks(filtered);
  }, [selectedCategory, sortBy, debouncedSearchQuery]);

  const handleViewDetails = (artwork) => {
    setSelectedArtwork(artwork);
    setShowArtworkModal(true);
  };

  const handleCloseArtworkModal = () => {
    setShowArtworkModal(false);
    setSelectedArtwork(null);
  };

  const handleViewArtist = (artistId) => {
    console.log('View artist:', artistId);
    alert('Artist profile feature coming soon!');
  };

  return (
    <div className="discovery-page" style={{ paddingTop: '80px' }}>
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <div 
        ref={(node) => {
          heroRef(node);
          heroParallaxRef(node);
        }}
        className={`discovery-hero ${heroVisible ? 'visible' : ''}`}
        style={{
          transform: `translateY(${heroParallaxOffset}px)`
        }}
      >
        <div className="discovery-hero-content">
          <div className="discovery-hero-text">
            <h1 className="discovery-title">
              <span className="discovery-title-main">Discover</span>
              <span className="discovery-title-accent">Masterpieces</span>
            </h1>
            <p className="discovery-subtitle">
              Explore our curated collection of handcrafted artworks from talented artisans. 
              Each piece tells a story, crafted with passion and traditional techniques.
            </p>
          </div>
          
          <div className="discovery-stats">
            <div className="discovery-stat">
              <span className="stat-number">{artworks.length}</span>
              <span className="stat-label">Artworks</span>
            </div>
            <div className="discovery-stat">
              <span className="stat-number">{categories.length}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="discovery-stat">
              <span className="stat-number">{getFeaturedArtworks().length}</span>
              <span className="stat-label">Featured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div 
        ref={filtersRef}
        className={`discovery-filters ${filtersVisible ? 'visible' : ''}`}
      >
        <div className="container">
          <div className="filters-content">
            {/* Search Bar */}
            <div className="discovery-search">
              <input
                type="text"
                placeholder="Search artworks, artists, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="discovery-search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            {/* Category Filters */}
            <div className="category-filters">
              <button
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Artworks
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort and Price Controls */}
            <div className="discovery-controls">
              <div className="sort-control">
                <label>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artworks Gallery */}
      <div 
        ref={galleryRef}
        className={`discovery-gallery ${galleryVisible ? 'visible' : ''}`}
        id="gallery"
      >
        <div className="container">
          <div className="discovery-results">
            <h2 className="results-title">
              {filteredArtworks.length} {filteredArtworks.length === 1 ? 'Artwork' : 'Artworks'} Found
            </h2>
            
            {filteredArtworks.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🎨</div>
                <h3>No artworks found</h3>
                <p>Try adjusting your search criteria or explore different categories.</p>
              </div>
            ) : (
              <div className="artworks-grid">
                {filteredArtworks.map((artwork, index) => (
                  <div key={artwork.id} className="artwork-item">
                    <ProductCard 
                      artwork={artwork} 
                      index={index}
                      onViewDetails={() => handleViewDetails(artwork)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
};

export default DiscoveryPage;