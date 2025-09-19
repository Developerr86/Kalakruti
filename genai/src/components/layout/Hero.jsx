import React from 'react';
import { Link } from 'react-router-dom';
import { featuredArtist } from '../../data/mockData';
import { useMultiLayerParallax, useScrollAnimation, useTextReveal, useImageReveal, useMagneticEffect, useFloatingAnimation, useMorphingBackground, useSmoothScroll } from '../../hooks';
import PlasmaBackground from '../ui/PlasmaBackground';
import './Hero.css';

const Hero = ({ onExploreClick, onViewArtistClick }) => {
  const { getParallaxStyle } = useMultiLayerParallax();
  const [titleRef, titleVisible] = useScrollAnimation(0.3, true);
  const [subtitleRef] = useTextReveal(0.05);
  const [imageRef] = useImageReveal('scale', 1.2);
  const [buttonRef] = useMagneticEffect(0.2);
  const [cardRef, cardVisible, cardProgress, velocity] = useScrollAnimation(0.2, false);
  const [floatingRef1] = useFloatingAnimation(0.5, 0.8);
  const [floatingRef2] = useFloatingAnimation(0.3, 1.2);
  const [floatingRef3] = useFloatingAnimation(0.7, 0.6);
  const [morphingRef] = useMorphingBackground();
  const { scrollToElement } = useSmoothScroll();

  return (
    <section 
      className="hero" 
      id="home"
    >
      <div className="hero-background">
        <PlasmaBackground />
        <div className="hero-overlay"></div>

        {/* Floating decorative elements with enhanced animations */}
        <div 
          ref={floatingRef1}
          className="parallax-element parallax-circle-1"
          style={{
            ...getParallaxStyle(-0.3, 'translateY'),
            filter: `blur(${velocity * 0.5}px)`,
            transform: `${getParallaxStyle(-0.3, 'translateY').transform} scale(${1 + velocity * 0.01})`
          }}
        ></div>
        <div 
          ref={floatingRef2}
          className="parallax-element parallax-circle-2"
          style={{
            ...getParallaxStyle(0.4, 'translateY'),
            opacity: 0.8 - velocity * 0.02
          }}
        ></div>
        <div 
          ref={floatingRef3}
          className="parallax-element parallax-circle-3"
          style={{
            ...getParallaxStyle(-0.2, 'rotate'),
            transform: `${getParallaxStyle(-0.2, 'rotate').transform} rotate(${velocity * 2}deg)`
          }}
        ></div>
        
        {/* Morphing background overlay */}
        <div 
          ref={morphingRef}
          className="hero-morphing-background"
        ></div>
      </div>
      
      <div className="container">
          <div className="hero-content">
            <div 
              className="hero-text"
              style={getParallaxStyle(0.1, 'translateY')}
            >
            <h1 
              ref={titleRef}
              className={`hero-title ${titleVisible ? 'animate-in' : ''}`}
            >
              <span 
                className="hero-title-line"
                style={{
                  transform: titleVisible ? 'translateY(0) rotateX(0deg)' : 'translateY(100px) rotateX(-15deg)',
                  opacity: titleVisible ? 1 : 0,
                  transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                Discover Extraordinary
              </span>
              <span 
                className="hero-title-accent hero-title-line"
                style={{
                  transform: titleVisible ? 'translateY(0) rotateX(0deg) scale(1)' : 'translateY(100px) rotateX(-15deg) scale(0.9)',
                  opacity: titleVisible ? 1 : 0,
                  transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s'
                }}
              >
                Artisan Crafts
              </span>
            </h1>
            
            <p 
              ref={subtitleRef}
              className="hero-subtitle"
            >
              Immerse yourself in the world of traditional craftsmanship and contemporary artistry. 
              Explore unique handmade pieces and discover the stories behind each creation.
            </p>
            
            <div 
              className="hero-stats"
              style={{
                ...getParallaxStyle(0.12, 'translateY'),
                transform: `${getParallaxStyle(0.12, 'translateY').transform} ${titleVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)'}`,
                opacity: titleVisible ? 1 : 0,
                transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s'
              }}
            >
              <div className="hero-stat enchanted-stat">
                <span className="hero-stat-number">100+</span>
                <span className="hero-stat-label">Artworks</span>
              </div>
              <div className="hero-stat enchanted-stat">
                <span className="hero-stat-number">25+</span>
                <span className="hero-stat-label">Artists</span>
              </div>
              <div className="hero-stat enchanted-stat">
                <span className="hero-stat-number">4</span>
                <span className="hero-stat-label">Collections</span>
              </div>
            </div>
            
            <div 
              className="hero-actions"
              style={{
                ...getParallaxStyle(0.1, 'translateY'),
                transform: `${getParallaxStyle(0.1, 'translateY').transform} ${titleVisible ? 'translateY(0) rotateX(0deg)' : 'translateY(30px) rotateX(-10deg)'}`,
                opacity: titleVisible ? 1 : 0,
                transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1s'
              }}
            >
              <Link 
                to="/discovery"
                ref={buttonRef}
                className="btn-primary hero-cta magnetic-button enhanced-button"
              >
                <span className="button-text">Explore Gallery</span>
                <span className="button-icon">✨</span>
              </Link>
              <Link 
                to="/discovery"
                className="btn-secondary hero-cta enhanced-button"
              >
                <span className="button-text">Discover Artists</span>
                <span className="button-icon">🎨</span>
              </Link>
            </div>
          </div>
          

        </div>
      </div>
      
      <div 
        className="hero-scroll-indicator"
        style={getParallaxStyle(0.2, 'translateY')}
      >
        <div className="scroll-arrow">
          <span>↓</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;