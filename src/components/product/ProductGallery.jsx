import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { dataService } from '../../firebase/dataService';
import { useMultiLayerParallax, useScrollAnimation, useTextReveal, useFloatingAnimation } from '../../hooks';
import './ProductGallery.css';

const ProductGallery = ({ 
  searchQuery = '', 
  selectedCategory = 'all', 
  onQuickView,
  onAddToCart 
}) => {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [sortBy, setSortBy] = useState('featured'); // featured, newest, popular, oldest
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getParallaxStyle } = useMultiLayerParallax();
  const [titleRef] = useTextReveal(0.03);
  const [categoriesRef, categoriesVisible] = useScrollAnimation(0.2, true);
  const [floatingShape1] = useFloatingAnimation(0.3, 0.5);
  const [floatingShape2] = useFloatingAnimation(0.4, 0.8);
  const [floatingShape3] = useFloatingAnimation(0.2, 1.2);

  // Load initial data from Firebase
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [artworksData, categoriesData] = await Promise.all([
          dataService.getArtworks(),
          dataService.getCategories()
        ]);
        
        setArtworks(artworksData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading gallery data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (artworks.length === 0) return;
    
    // Simulate loading delay for better UX
    const timeoutId = setTimeout(() => {
      let filtered = [...artworks];

      // Apply category filter
      if (selectedCategory && selectedCategory !== 'all') {
        filtered = filtered.filter(artwork => artwork.category === selectedCategory);
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(artwork => 
          artwork.title.toLowerCase().includes(query) ||
          artwork.description.toLowerCase().includes(query) ||
          artwork.artistName.toLowerCase().includes(query) ||
          (artwork.tags && artwork.tags.some(tag => tag.toLowerCase().includes(query))) ||
          artwork.materials.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      switch (sortBy) {
        case 'featured':
          filtered.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
          });
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt || b.yearCreated) - new Date(a.createdAt || a.yearCreated));
          break;
        case 'popular':
          filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.createdAt || a.yearCreated) - new Date(b.createdAt || b.yearCreated));
          break;
        default:
          break;
      }

      setFilteredArtworks(filtered);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, sortBy, artworks]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const getSelectedCategoryName = () => {
    if (selectedCategory === 'all') return 'All Artworks';
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.name : 'All Artworks';
  };

  // Show error state
  if (error) {
    return (
      <section className="product-gallery" id="gallery">
        <div className="container">
          <div className="gallery-error">
            <h2>Unable to load gallery</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="product-gallery" id="gallery">
      {/* Enhanced parallax background elements */}
      <div className="gallery-parallax-bg">
        <div 
          ref={floatingShape1}
          className="parallax-shape parallax-shape-1 enhanced-shape"
          style={getParallaxStyle(-0.3, 'translateY')}
        ></div>
        <div 
          ref={floatingShape2}
          className="parallax-shape parallax-shape-2 enhanced-shape"
          style={getParallaxStyle(0.25, 'translateY')}
        ></div>
        <div 
          ref={floatingShape3}
          className="parallax-shape parallax-shape-3 enhanced-shape"
          style={getParallaxStyle(-0.15, 'rotate')}
        ></div>
        
        {/* Additional floating elements */}
        <div className="gallery-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>
      </div>
      
      <div className="container">
        {/* Gallery Header */}
        <div 
          className="gallery-header"
          style={getParallaxStyle(0.05, 'translateY')}
        >
          <div className="gallery-title-section">
            <h2 
              ref={titleRef}
              className="gallery-title"
            >
              {searchQuery ? `Search Results for "${searchQuery}"` : getSelectedCategoryName()}
            </h2>
            <p className="gallery-subtitle">
              {filteredArtworks.length} {filteredArtworks.length === 1 ? 'artwork' : 'artworks'} found
            </p>
          </div>

          <div className="gallery-controls">
            {/* Sort Controls */}
            <div className="sort-control">
              <label htmlFor="sort-select" className="sort-label">Sort by:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* View Mode Controls */}
            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('grid')}
                aria-label="Grid view"
              >
                <span className="view-icon">⊞</span>
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('list')}
                aria-label="List view"
              >
                <span className="view-icon">☰</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div 
          className="category-tabs"
          style={getParallaxStyle(0.03, 'translateY')}
        >
          <button
            className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => window.dispatchEvent(new CustomEvent('categoryChange', { detail: 'all' }))}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => window.dispatchEvent(new CustomEvent('categoryChange', { detail: category.id }))}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="gallery-loading">
            <div className="loading-spinner-large"></div>
            <p>Loading artworks...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredArtworks.length === 0 && (
          <div className="gallery-empty">
            <div className="empty-icon">🎨</div>
            <h3>No artworks found</h3>
            <p>
              {searchQuery 
                ? `Try adjusting your search terms or browse all categories.`
                : `No artworks available in this category.`
              }
            </p>
            {searchQuery && (
              <button 
                className="btn-primary"
                onClick={() => window.dispatchEvent(new CustomEvent('clearSearch'))}
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Artworks Grid/List */}
        {!isLoading && filteredArtworks.length > 0 && (
          <div className={`artworks-container ${viewMode} premium-grid`}>
            {filteredArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                className="artwork-item premium-item"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  ...getParallaxStyle(0.01 + (index % 5) * 0.005, 'translateY')
                }}
              >
                <ProductCard
                  artwork={artwork}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  index={index}
                />
              </div>
            ))}
          </div>
        )}

        {/* Featured Categories Section */}
        {!searchQuery && selectedCategory === 'all' && !isLoading && (
          <div 
            ref={categoriesRef}
            className="featured-categories"
            style={{
              ...getParallaxStyle(0.08, 'translateY'),
              transform: `${getParallaxStyle(0.08, 'translateY').transform} ${categoriesVisible ? 'translateY(0)' : 'translateY(50px)'}`,
              opacity: categoriesVisible ? 1 : 0,
              transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <h3 className="featured-categories-title premium-title">
              <span className="title-decoration"></span>
              Explore by Category
              <span className="title-decoration"></span>
            </h3>
            <div className="category-grid">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="category-card advanced-card parallax-hover-category"
                  style={{
                    ...getParallaxStyle(0.04 + (index % 2) * 0.02, 'translateY'),
                    transform: `${getParallaxStyle(0.04 + (index % 2) * 0.02, 'translateY').transform} ${categoriesVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)'}`,
                    opacity: categoriesVisible ? 1 : 0,
                    transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`
                  }}
                  onClick={() => window.dispatchEvent(new CustomEvent('categoryChange', { detail: category.id }))}
                >
                  <div className="category-image hover-category-image">
                    <img src={category.image} alt={category.name} />
                    <div className="category-overlay hover-category-overlay"></div>
                  </div>
                  <div className="category-info hover-category-info">
                    <h4 className="category-name">{category.name}</h4>
                    <p className="category-description">{category.description}</p>
                    <span className="category-count">
                      {artworks.filter(art => art.category === category.id).length} items
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGallery;