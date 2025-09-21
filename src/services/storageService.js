import { vercelBlobService } from './vercelBlobService';
import { storageService as firebaseStorageService } from '../firebase/storageService';

// Storage provider configuration
const STORAGE_PROVIDER = import.meta.env.VITE_STORAGE_PROVIDER || 'vercel'; // 'vercel' or 'firebase'

class UnifiedStorageService {
  constructor() {
    this.provider = STORAGE_PROVIDER;
    this.service = this.getStorageService();
  }

  getStorageService() {
    switch (this.provider) {
      case 'firebase':
        return firebaseStorageService;
      case 'vercel':
      default:
        return vercelBlobService;
    }
  }

  // Upload a file
  async uploadFile(file, path, options = {}) {
    try {
      return await this.service.uploadFile(file, path, options);
    } catch (error) {
      console.error(`Error uploading file with ${this.provider}:`, error);
      throw error;
    }
  }

  // Upload artwork image
  async uploadArtworkImage(file, artworkId, options = {}) {
    try {
      return await this.service.uploadArtworkImage(file, artworkId, options);
    } catch (error) {
      console.error(`Error uploading artwork image with ${this.provider}:`, error);
      throw error;
    }
  }

  // Upload user avatar
  async uploadUserAvatar(file, userId, options = {}) {
    try {
      return await this.service.uploadUserAvatar(file, userId, options);
    } catch (error) {
      console.error(`Error uploading user avatar with ${this.provider}:`, error);
      throw error;
    }
  }

  // Upload artist image
  async uploadArtistImage(file, artistId, imageType = 'profile', options = {}) {
    try {
      return await this.service.uploadArtistImage(file, artistId, imageType, options);
    } catch (error) {
      console.error(`Error uploading artist image with ${this.provider}:`, error);
      throw error;
    }
  }

  // Delete a file
  async deleteFile(path) {
    try {
      return await this.service.deleteFile(path);
    } catch (error) {
      console.error(`Error deleting file with ${this.provider}:`, error);
      throw error;
    }
  }

  // List files
  async listFiles(path) {
    try {
      return await this.service.listFiles(path);
    } catch (error) {
      console.error(`Error listing files with ${this.provider}:`, error);
      throw error;
    }
  }

  // Delete artwork files
  async deleteArtworkFiles(artworkId) {
    try {
      return await this.service.deleteArtworkFiles(artworkId);
    } catch (error) {
      console.error(`Error deleting artwork files with ${this.provider}:`, error);
      throw error;
    }
  }

  // Delete user files
  async deleteUserFiles(userId) {
    try {
      return await this.service.deleteUserFiles(userId);
    } catch (error) {
      console.error(`Error deleting user files with ${this.provider}:`, error);
      throw error;
    }
  }

  // Get download URL
  async getDownloadURL(path) {
    try {
      return await this.service.getDownloadURL(path);
    } catch (error) {
      console.error(`Error getting download URL with ${this.provider}:`, error);
      throw error;
    }
  }

  // Utility methods
  validateImageFile(file, allowedTypes) {
    return this.service.validateImageFile(file, allowedTypes);
  }

  validateFileSize(file, maxSizeInMB) {
    return this.service.validateFileSize(file, maxSizeInMB);
  }

  // Get current provider
  getProvider() {
    return this.provider;
  }

  // Check if storage is configured
  isConfigured() {
    if (typeof this.service.isConfigured === 'function') {
      return this.service.isConfigured();
    }
    return true; // Assume configured if method doesn't exist
  }
}

// Create and export singleton instance
export const storageService = new UnifiedStorageService();
export default storageService;