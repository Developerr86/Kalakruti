import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import HomePage from './components/pages/HomePage';
import DiscoveryPage from './components/pages/DiscoveryPage';
import StoryPage from './components/pages/StoryPage';
import MyArtworksPage from './components/pages/MyArtworksPage';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show authentication page if user is not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show main application if user is authenticated
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/story/:artworkId" element={<StoryPage />} />
        <Route path="/my-artworks" element={<MyArtworksPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
