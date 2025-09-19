import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import DiscoveryPage from './components/pages/DiscoveryPage';
import StoryPage from './components/pages/StoryPage';
import MyArtworksPage from './components/pages/MyArtworksPage';
import './App.css';

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discovery" element={<DiscoveryPage />} />
          <Route path="/story/:artworkId" element={<StoryPage />} />
          <Route path="/my-artworks" element={<MyArtworksPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
