import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import Hero from '../layout/Hero';
import { useMultiLayerParallax, useFloatingAnimation } from '../../hooks';

function HomePage() {
  const { getParallaxStyle } = useMultiLayerParallax();
  const [floatingElement1] = useFloatingAnimation(0.2, 0.3);
  const [floatingElement2] = useFloatingAnimation(0.3, 0.5);
  const [floatingElement3] = useFloatingAnimation(0.15, 0.7);

  const handleExploreClick = () => {
    // This will be handled by the Hero component's link to Discovery page
  };

  const handleViewArtist = (artistId) => {
    // In a real app, this would navigate to artist profile
    console.log('View artist:', artistId);
    alert('Artist profile feature coming soon!');
  };

  return (
    <div className="home-page" style={{ paddingTop: '80px' }}>
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
      <Header />
      
      {/* Hero Section */}
      <Hero
        onExploreClick={handleExploreClick}
        onViewArtistClick={handleViewArtist}
      />
    </div>
  );
}

export default HomePage;