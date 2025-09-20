import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParallax, useScrollAnimation, useImageReveal, useMorphingBackground, useParallaxHover, useMultiLayerHover } from '../../hooks';
import './ProductCard.css';

const ArtworkCard = ({ artwork, onViewDetails, onViewArtist, index = 0 }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const [cardRef, parallaxOffset] = useParallax(0.05 + (index % 3) * 0.02, 'vertical');
  const [containerRef, isVisible, scrollProgress, velocity] = useScrollAnimation(0.3, true);
  const [imageRef] = useImageReveal('up', 0.8);
  const [morphingRef] = useMorphingBackground();
  
  // Parallax hover effects
  const [cardHoverRef, getCardHoverStyle, isCardHovering] = useParallaxHover(0.4, 0.8);
  const [layerHoverRef, getLayerStyle, isLayerHovering] = useMultiLayerHover([
    { intensity: 1, depth: 1 },        // Main card
    { intensity: 0.6, depth: 0.5 },    // Image layer  
    { intensity: 1.2, depth: 1.5 },    // Badge layer
    { intensity: 0.8, depth: 0.3 }     // Info layer
  ]);

  const handleCardClick = (e) => {
    e.preventDefault();
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Add scale-up animation class
    const cardElement = e.currentTarget;
    cardElement.classList.add('story-transition');
    
    // Navigate after animation starts
    setTimeout(() => {
      navigate(`/story/${artwork.id}`);
    }, 300);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(artwork);
    }
  };

  const handleViewArtist = (e) => {
    e.stopPropagation();
    if (onViewArtist) {
      onViewArtist(artwork.artist);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoaded(true);
  };

  return (
    <div 
      ref={(node) => {
        cardRef(node);
        containerRef(node);
        morphingRef(node);
        cardHoverRef(node);
        layerHoverRef(node);
      }}
      className={`artwork-card premium-artwork-card parallax-hover-card ${isVisible ? 'reveal-active' : ''} ${isTransitioning ? 'story-transition' : ''}`}
      onClick={handleCardClick}
      style={{
        ...getCardHoverStyle(),
        transform: `${getCardHoverStyle().transform} translateY(${parallaxOffset}px) scale(${0.95 + scrollProgress * 0.05}) rotateX(${velocity * 0.3}deg)`,
        opacity: 0.8 + scrollProgress * 0.2,
        transition: isVisible ? 'opacity 1s ease' : 'none',
        animationDelay: `${index * 0.1}s`,
        cursor: 'pointer'
      }}
    >
      <div 
        ref={imageRef}
        className="artwork-image-container premium-image-container hover-image-container"
        style={getLayerStyle(1)}
      >
        {!isImageLoaded && !imageError && (
          <div className="artwork-image-loading premium-loading">
            <div className="loading-spinner premium-spinner"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="artwork-image-error">
            <span className="error-icon">🖼️</span>
            <span className="error-text">Image unavailable</span>
          </div>
        ) : (
          <img
            src={artwork.image}
            alt={artwork.title}
            className="artwork-image"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: isImageLoaded ? 1 : 0 }}
          />
        )}
      </div>
    </div>
  );
};

export default ArtworkCard;