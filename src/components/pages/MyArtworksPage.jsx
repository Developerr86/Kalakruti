import React, { useState, useEffect } from 'react';
import { where, orderBy } from 'firebase/firestore';
import { useScrollAnimation, useTextReveal, useImageReveal } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { firestoreService } from '../../firebase/firestoreService';
import Header from '../layout/Header';
import './MyArtworksPage.css';

const MyArtworksPage = () => {
  const { user } = useAuth();
  const [userArtworks, setUserArtworks] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'paintings',
    materials: '',
    dimensions: '',
    image: null,
    imagePreview: null,
    tags: '',
    price: ''
  });

  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(0.3, true);
  const [titleRef] = useTextReveal(0.05);
  const [galleryRef, galleryVisible] = useScrollAnimation(0.2, true);
  const [uploadRef, uploadVisible] = useScrollAnimation(0.3, true);

  const categories = [
    { id: 'paintings', name: 'Paintings' },
    { id: 'pottery', name: 'Pottery' },
    { id: 'sculptures', name: 'Sculptures' },
    { id: 'handicrafts', name: 'Handicrafts' }
  ];

  // Load user artworks from Firestore on component mount
  useEffect(() => {
    const loadUserArtworks = async () => {
      if (!user) return;
      
      try {
        const artworks = await firestoreService.queryCollection('artworks', [
          where('artistId', '==', user.uid),
          orderBy('createdAt', 'desc')
        ]);
        setUserArtworks(artworks);
      } catch (error) {
        console.error('Error loading user artworks:', error);
        // Fallback to localStorage for backward compatibility
        const savedArtworks = localStorage.getItem('userArtworks');
        if (savedArtworks) {
          setUserArtworks(JSON.parse(savedArtworks));
        }
      }
    };

    loadUserArtworks();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadForm(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setUploadError('You must be logged in to upload artwork');
      return;
    }

    if (!uploadForm.image) {
      setUploadError('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Generate artwork ID
      const artworkId = `artwork_${Date.now()}_${user.uid}`;
      
      // Upload image to Vercel Blob storage
      const uploadResult = await storageService.uploadArtworkImage(
        uploadForm.image, 
        artworkId,
        {
          onProgress: (progress) => {
            setUploadProgress(progress);
          },
          metadata: {
            title: uploadForm.title,
            artistId: user.uid,
            category: uploadForm.category
          }
        }
      );

      // Create artwork document in Firestore
      const artworkData = {
        title: uploadForm.title,
        description: uploadForm.description,
        category: uploadForm.category,
        materials: uploadForm.materials,
        dimensions: uploadForm.dimensions,
        price: uploadForm.price ? parseFloat(uploadForm.price) : null,
        image: uploadResult.downloadURL,
        imagePath: uploadResult.path,
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        artistId: user.uid,
        artistName: user.displayName || user.email,
        yearCreated: new Date().getFullYear(),
        status: 'published', // Changed from 'pending' to 'published' - no review needed
        visibility: 'public',
        views: 0,
        likes: 0,
        featured: false,
        uploadMetadata: uploadResult.metadata
      };

      const newArtwork = await firestoreService.create('artworks', artworkData);
      
      // Update local state
      setUserArtworks(prev => [newArtwork, ...prev]);

      // Reset form
      setUploadForm({
        title: '',
        description: '',
        category: 'paintings',
        materials: '',
        dimensions: '',
        image: null,
        imagePreview: null,
        tags: '',
        price: ''
      });
      
      setUploadProgress(0);
      setIsUploading(false);
      setShowUploadModal(false);
      
      // Show success message
      alert('Artwork uploaded successfully and is now live in the discovery section!');
      
    } catch (error) {
      console.error('Error uploading artwork:', error);
      setUploadError(error.message || 'Failed to upload artwork. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteArtwork = async (artworkId) => {
    if (!confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      return;
    }

    try {
      const artwork = userArtworks.find(art => art.id === artworkId);
      
      // Delete image from storage if it exists
      if (artwork && artwork.imagePath) {
        try {
          await storageService.deleteFile(artwork.image);
        } catch (error) {
          console.warn('Error deleting image from storage:', error);
          // Continue with artwork deletion even if image deletion fails
        }
      }
      
      // Delete artwork document from Firestore
      await firestoreService.delete('artworks', artworkId);
      
      // Update local state
      setUserArtworks(prev => prev.filter(artwork => artwork.id !== artworkId));
      
      alert('Artwork deleted successfully');
    } catch (error) {
      console.error('Error deleting artwork:', error);
      alert('Failed to delete artwork. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      published: { text: 'Live', class: 'status-published' },
      draft: { text: 'Draft', class: 'status-draft' },
      archived: { text: 'Archived', class: 'status-archived' }
    };
    return badges[status] || badges.published;
  };

  return (
    <div className="my-artworks-page">
      <Header />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`my-artworks-hero ${heroVisible ? 'visible' : ''}`}
      >
        <div className="container">
          <div className="hero-content">
            <h1 ref={titleRef} className="page-title">
              My Artworks
            </h1>
            <p className="page-subtitle">
              Share your creativity with the world. Upload and manage your artwork portfolio.
            </p>
            <button 
              className="upload-btn primary"
              onClick={() => setShowUploadModal(true)}
            >
              <span className="btn-icon">📤</span>
              Upload New Artwork
            </button>
          </div>
        </div>
      </section>

      {/* User Artworks Gallery */}
      <section className="artworks-gallery">
        <div className="container">
          
          {/* Stats Overview */}
          <div 
            ref={uploadRef}
            className={`stats-overview ${uploadVisible ? 'visible' : ''}`}
          >
            <div className="stat-item">
              <span className="stat-number">{userArtworks.length}</span>
              <span className="stat-label">Total Artworks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {userArtworks.filter(art => art.status === 'published').length}
              </span>
              <span className="stat-label">Published</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {userArtworks.reduce((total, art) => total + (art.views || 0), 0)}
              </span>
              <span className="stat-label">Total Views</span>
            </div>
          </div>

          {/* Artworks Grid */}
          <div 
            ref={galleryRef}
            className={`user-artworks-grid ${galleryVisible ? 'visible' : ''}`}
          >
            {userArtworks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎨</div>
                <h3>No artworks yet</h3>
                <p>Start by uploading your first artwork to build your portfolio.</p>
                <button 
                  className="upload-btn secondary"
                  onClick={() => setShowUploadModal(true)}
                >
                  Upload Your First Artwork
                </button>
              </div>
            ) : (
              userArtworks.map((artwork, index) => (
                <div 
                  key={artwork.id} 
                  className="user-artwork-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="artwork-image-container">
                    <img 
                      src={artwork.image} 
                      alt={artwork.title}
                      className="artwork-image"
                    />
                    <div className="artwork-overlay">
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteArtwork(artwork.id)}
                        title="Delete artwork"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="artwork-info">
                    <div className="artwork-header">
                      <h3 className="artwork-title">{artwork.title}</h3>
                      <span className={`status-badge ${getStatusBadge(artwork.status).class}`}>
                        {getStatusBadge(artwork.status).text}
                      </span>
                    </div>
                    
                    <p className="artwork-description">{artwork.description}</p>
                    
                    <div className="artwork-details">
                      <span className="detail-item">
                        <strong>Category:</strong> {artwork.category}
                      </span>
                      <span className="detail-item">
                        <strong>Materials:</strong> {artwork.materials}
                      </span>
                      <span className="detail-item">
                        <strong>Dimensions:</strong> {artwork.dimensions}
                      </span>
                      <span className="detail-item">
                        <strong>Uploaded:</strong> {new Date(artwork.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {artwork.tags.length > 0 && (
                      <div className="artwork-tags">
                        {artwork.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="upload-modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload New Artwork</h2>
              <button 
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="upload-form">
              {uploadError && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {uploadError}
                </div>
              )}
              
              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{Math.round(uploadProgress)}% uploaded</span>
                </div>
              )}
              
              <div className="form-grid">
                
                {/* Image Upload */}
                <div className="form-group image-upload">
                  <label className="image-upload-label">
                    {uploadForm.imagePreview ? (
                      <img 
                        src={uploadForm.imagePreview} 
                        alt="Preview" 
                        className="image-preview"
                      />
                    ) : (
                      <div className="upload-placeholder">
                        <span className="upload-icon">📸</span>
                        <span>Click to upload image</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      required
                      hidden
                    />
                  </label>
                </div>

                <div className="form-fields">
                  {/* Title */}
                  <div className="form-group">
                    <label htmlFor="title">Artwork Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={uploadForm.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter artwork title"
                    />
                  </div>

                  {/* Category */}
                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={uploadForm.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Materials */}
                  <div className="form-group">
                    <label htmlFor="materials">Materials *</label>
                    <input
                      type="text"
                      id="materials"
                      name="materials"
                      value={uploadForm.materials}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Oil on canvas, Clay, Bronze"
                    />
                  </div>

                  {/* Dimensions */}
                  <div className="form-group">
                    <label htmlFor="dimensions">Dimensions *</label>
                    <input
                      type="text"
                      id="dimensions"
                      name="dimensions"
                      value={uploadForm.dimensions}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 24' x 36', 15cm x 20cm"
                    />
                  </div>

                  {/* Price */}
                  <div className="form-group">
                    <label htmlFor="price">Price (optional)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={uploadForm.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="Enter price in USD"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={uploadForm.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Describe your artwork, inspiration, or technique..."
                />
              </div>

              {/* Tags */}
              <div className="form-group">
                <label htmlFor="tags">Tags (comma-separated)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={uploadForm.tags}
                  onChange={handleInputChange}
                  placeholder="abstract, landscape, modern, colorful"
                />
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Uploading...
                    </>
                  ) : (
                    'Upload Artwork'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyArtworksPage;