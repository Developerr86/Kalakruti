import React from 'react';
import './PlasmaBackground.css';

const PlasmaBackground = ({ className = '', style = {} }) => {
  return (
    <div className={`plasma-background ${className}`} style={style}>
      <div className="plasma-layer plasma-layer-1"></div>
      <div className="plasma-layer plasma-layer-2"></div>
      <div className="plasma-layer plasma-layer-3"></div>
      <div className="plasma-layer plasma-layer-4"></div>
    </div>
  );
};

export default PlasmaBackground;