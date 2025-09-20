import React, { useState, useEffect, useRef } from 'react';
import './CoverFlow.css';

const CoverFlow = ({ 
  items = [], 
  initialIndex = 0, 
  onItemClick = () => {}, 
  className = '',
  autoPlay = false,
  autoPlayInterval = 3000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isDragging) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % items.length);
      }, autoPlayInterval);
    } else {
      clearInterval(autoPlayRef.current);
    }

    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay, autoPlayInterval, isDragging, items.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleItemClick(currentIndex);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  const handleItemClick = (index) => {
    if (index === currentIndex) {
      onItemClick(items[index], index);
    } else {
      setCurrentIndex(index);
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    setTranslateX(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const threshold = 50;
    if (translateX > threshold) {
      goToPrevious();
    } else if (translateX < -threshold) {
      goToNext();
    }
    
    setTranslateX(0);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startX;
    setTranslateX(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const threshold = 50;
    if (translateX > threshold) {
      goToPrevious();
    } else if (translateX < -threshold) {
      goToNext();
    }
    
    setTranslateX(0);
  };

  // Calculate item position and style
  const getItemStyle = (index) => {
    const offset = index - currentIndex;
    const absOffset = Math.abs(offset);
    
    // Base styles
    let transform = '';
    let zIndex = items.length - absOffset;
    let opacity = 1;
    let filter = '';
    
    if (offset === 0) {
      // Center item
      transform = `translateX(${translateX}px) translateZ(0) rotateY(0deg) scale(1)`;
      opacity = 1;
      zIndex = items.length + 1;
    } else if (offset > 0) {
      // Right side items
      const translateXVal = 150 * offset + translateX;
      const rotateY = Math.min(45, 20 * offset);
      const scale = Math.max(0.7, 1 - 0.1 * absOffset);
      transform = `translateX(${translateXVal}px) translateZ(-${50 * absOffset}px) rotateY(-${rotateY}deg) scale(${scale})`;
      opacity = Math.max(0.3, 1 - 0.2 * absOffset);
      filter = `blur(${Math.min(2, absOffset * 0.5)}px)`;
    } else {
      // Left side items
      const translateXVal = -150 * absOffset + translateX;
      const rotateY = Math.min(45, 20 * absOffset);
      const scale = Math.max(0.7, 1 - 0.1 * absOffset);
      transform = `translateX(${translateXVal}px) translateZ(-${50 * absOffset}px) rotateY(${rotateY}deg) scale(${scale})`;
      opacity = Math.max(0.3, 1 - 0.2 * absOffset);
      filter = `blur(${Math.min(2, absOffset * 0.5)}px)`;
    }

    return {
      transform,
      zIndex,
      opacity,
      filter,
      transition: isDragging ? 'none' : 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
  };

  if (!items.length) return null;

  return (
    <div className={`coverflow-container ${className}`}>
      <div 
        ref={containerRef}
        className="coverflow-stage"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className={`coverflow-item ${index === currentIndex ? 'active' : ''}`}
            style={getItemStyle(index)}
            onClick={() => handleItemClick(index)}
          >
            <div className="coverflow-item-inner">
              <img 
                src={item.image || item.src || item} 
                alt={item.title || item.alt || `Gallery item ${index + 1}`}
                loading="lazy"
                draggable={false}
              />
              {item.title && (
                <div className="coverflow-item-overlay">
                  <h3 className="coverflow-item-title">{item.title}</h3>
                  {item.description && (
                    <p className="coverflow-item-description">{item.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="coverflow-dots">
        {items.map((_, index) => (
          <button
            key={index}
            className={`coverflow-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button 
        className="coverflow-nav coverflow-nav-prev"
        onClick={goToPrevious}
        aria-label="Previous image"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M15 18L9 12L15 6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      <button 
        className="coverflow-nav coverflow-nav-next"
        onClick={goToNext}
        aria-label="Next image"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M9 18L15 12L9 6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Current image info */}
      {items[currentIndex] && (
        <div className="coverflow-info">
          <div className="coverflow-counter">
            {currentIndex + 1} / {items.length}
          </div>
          {items[currentIndex].title && (
            <h3 className="coverflow-current-title">
              {items[currentIndex].title}
            </h3>
          )}
        </div>
      )}
    </div>
  );
};

export default CoverFlow;