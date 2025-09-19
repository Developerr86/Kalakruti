import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtworkById, getArtistById } from '../../data/mockData';
import { useScrollAnimation, useTextReveal, useImageReveal } from '../../hooks';
import Header from '../layout/Header';
import './StoryPage.css';

const StoryPage = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(0.3, true);
  const [titleRef] = useTextReveal(0.05);
  const [galleryRef, galleryVisible] = useScrollAnimation(0.2, true);
  const [videoRef, videoVisible] = useScrollAnimation(0.3, true);
  const [aboutRef, aboutVisible] = useScrollAnimation(0.3, true);
  const [purchaseRef, purchaseVisible] = useScrollAnimation(0.3, true);
  const [imageRef] = useImageReveal('scale', 1.1);

  useEffect(() => {
    if (artworkId) {
      const foundArtwork = getArtworkById(artworkId);
      if (foundArtwork) {
        setArtwork(foundArtwork);
        const foundArtist = getArtistById(foundArtwork.artist);
        setArtist(foundArtist);
      }
      setLoading(false);
    }
  }, [artworkId]);

  if (loading) {
    return (
      <div className="story-loading">
        <div className="loading-spinner"></div>
        <p>Loading artwork story...</p>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="story-not-found">
        <Header />
        <div className="not-found-content">
          <h1>Artwork Not Found</h1>
          <p>The artwork you're looking for doesn't exist.</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/discovery')}
          >
            Back to Discovery
          </button>
        </div>
      </div>
    );
  }

  const handlePurchase = () => {
    setShowPurchaseModal(true);
  };

  const handleClosePurchaseModal = () => {
    setShowPurchaseModal(false);
  };

  // Generate additional story content based on artwork
  const storyContent = {
    inspiration: `The inspiration for "${artwork.title}" came from ${artist?.location || 'the artist\'s surroundings'}, where ${artwork.artistName} found themselves captivated by the interplay of light, shadow, and emotion. This piece represents a moment of profound connection between the artist and their craft.`,
    process: `Created using ${artwork.materials}, this ${artwork.category.slice(0, -1)} required over 40 hours of meticulous work. Each brushstroke, each detail was carefully considered to bring the vision to life. The ${artwork.dimensions} canvas became a window into the artist's soul.`,
    meaning: `"${artwork.title}" explores themes of ${artwork.tags.join(', ')}, inviting viewers to contemplate their own relationship with these concepts. The piece serves as both a mirror and a gateway to deeper understanding.`
  };

  return (
    <div className="story-page">
      <Header />
      
      {/* Hero Section with Main Artwork */}
      <section 
        ref={heroRef}
        className={`story-hero ${heroVisible ? 'visible' : ''}`}
      >
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-image" ref={imageRef}>
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="main-artwork-image"
              />
              <div className="image-glow"></div>
            </div>
            <div className="hero-text">
              <h1 ref={titleRef} className="story-title">
                {artwork.title}
              </h1>
              <p className="story-subtitle">
                By {artwork.artistName} • {artwork.yearCreated}
              </p>
              <div className="artwork-details">
                <span className="detail-item">{artwork.dimensions}</span>
                <span className="detail-separator">•</span>
                <span className="detail-item">{artwork.materials}</span>
                <span className="detail-separator">•</span>
                <span className="detail-item">${artwork.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Sections */}
      <section className="story-content">
        <div className="container">
          
          {/* Image Gallery */}
          <div 
            ref={galleryRef}
            className={`story-section image-gallery ${galleryVisible ? 'visible' : ''}`}
          >
            <h2 className="section-title">The Artwork</h2>
            <div className="gallery-grid">
              <div className="gallery-main">
                <img src={artwork.image} alt={artwork.title} />
              </div>
              <div className="gallery-thumbnails">
                <img src={artwork.image} alt={`${artwork.title} - Detail 1`} />
                <img src={artwork.image} alt={`${artwork.title} - Detail 2`} />
                <img src={artwork.image} alt={`${artwork.title} - Detail 3`} />
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div 
            ref={videoRef}
            className={`story-section video-section ${videoVisible ? 'visible' : ''}`}
          >
            <h2 className="section-title">Behind the Creation</h2>
            <div className="video-container">
              <div className="video-placeholder">
                <div className="video-play-button">
                  <span>▶</span>
                </div>
                <p>Watch the artist's creative process</p>
              </div>
            </div>
            <p className="video-description">
              Discover the artistic journey behind "{artwork.title}" and witness the passion that brings each piece to life.
            </p>
          </div>

          {/* Story Text Sections */}
          <div className="story-text-sections">
            <div className="text-section">
              <h3>The Inspiration</h3>
              <p>{storyContent.inspiration}</p>
            </div>
            
            <div className="text-section">
              <h3>The Process</h3>
              <p>{storyContent.process}</p>
            </div>
            
            <div className="text-section">
              <h3>The Meaning</h3>
              <p>{storyContent.meaning}</p>
            </div>
          </div>

          {/* About Art Section */}
          <div 
            ref={aboutRef}
            className={`story-section about-art ${aboutVisible ? 'visible' : ''}`}
          >
            <h2 className="section-title">About This Art</h2>
            <div className="about-content">
              <div className="about-text">
                <p className="artwork-description">{artwork.description}</p>
                <div className="artwork-specs">
                  <div className="spec-item">
                    <strong>Category:</strong> {artwork.category.charAt(0).toUpperCase() + artwork.category.slice(1)}
                  </div>
                  <div className="spec-item">
                    <strong>Materials:</strong> {artwork.materials}
                  </div>
                  <div className="spec-item">
                    <strong>Dimensions:</strong> {artwork.dimensions}
                  </div>
                  <div className="spec-item">
                    <strong>Year Created:</strong> {artwork.yearCreated}
                  </div>
                  <div className="spec-item">
                    <strong>Tags:</strong> {artwork.tags.join(', ')}
                  </div>
                </div>
              </div>
              <div className="about-artist">
                {artist && (
                  <>
                    <img 
                      src={artist.profileImage} 
                      alt={artist.name}
                      className="artist-profile"
                    />
                    <h4>{artist.name}</h4>
                    <p className="artist-location">{artist.location}</p>
                    <p className="artist-bio">{artist.bio}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Purchase Section */}
          <div 
            ref={purchaseRef}
            className={`story-section purchase-section ${purchaseVisible ? 'visible' : ''}`}
          >
            <div className="purchase-content">
              <div className="purchase-info">
                <h2>Own This Masterpiece</h2>
                <p>Bring "{artwork.title}" into your space and experience its beauty every day.</p>
                <div className="price-display">
                  <span className="price">${artwork.price.toLocaleString()}</span>
                  {artwork.inStock ? (
                    <span className="stock-status in-stock">In Stock</span>
                  ) : (
                    <span className="stock-status out-stock">Sold Out</span>
                  )}
                </div>
              </div>
              <button 
                className={`purchase-btn ${!artwork.inStock ? 'disabled' : ''}`}
                onClick={handlePurchase}
                disabled={!artwork.inStock}
              >
                {artwork.inStock ? 'Purchase Now' : 'Sold Out'}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="purchase-modal-overlay" onClick={handleClosePurchaseModal}>
          <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleClosePurchaseModal}>×</button>
            <h3>Purchase "{artwork.title}"</h3>
            <div className="modal-artwork">
              <img src={artwork.image} alt={artwork.title} />
              <div className="modal-details">
                <h4>{artwork.title}</h4>
                <p>By {artwork.artistName}</p>
                <p className="modal-price">${artwork.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="purchase-form">
              <button className="btn-primary">Add to Cart</button>
              <button className="btn-secondary">Contact Artist</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryPage;