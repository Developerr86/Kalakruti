import { put, del, list } from '@vercel/blob';

export class VercelBlobService {
  constructor() {
    // In Vite, environment variables need VITE_ prefix to be accessible in browser
    this.token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
    if (!this.token) {
      console.warn('VITE_BLOB_READ_WRITE_TOKEN not found. Blob operations will fail.');
    }
  }

  // Upload a file to Vercel Blob
  async uploadFile(file, path, options = {}) {
    try {
      const { 
        onProgress = null,
        metadata = {}
      } = options;

      // Validate file
      this.validateImageFile(file);
      this.validateFileSize(file);

      // Create filename with timestamp
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const fullPath = `${path}/${filename}`;

      // Upload to Vercel Blob
      const blob = await put(fullPath, file, {
        access: 'public',
        token: this.token,
        handleUploadUrl: onProgress ? this.createProgressHandler(onProgress) : undefined
      });

      return {
        downloadURL: blob.url,
        path: fullPath,
        name: file.name,
        size: file.size,
        metadata: {
          ...metadata,
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
          contentType: file.type
        }
      };
    } catch (error) {
      console.error('Error uploading file to Vercel Blob:', error);
      throw this.handleBlobError(error);
    }
  }

  // Upload artwork image
  async uploadArtworkImage(file, artworkId, options = {}) {
    try {
      const path = `artworks/${artworkId}`;
      const metadata = {
        artworkId,
        type: 'artwork_image',
        ...options.metadata
      };
      
      return await this.uploadFile(file, path, {
        ...options,
        metadata
      });
    } catch (error) {
      console.error('Error uploading artwork image:', error);
      throw error;
    }
  }

  // Upload user avatar
  async uploadUserAvatar(file, userId, options = {}) {
    try {
      const path = `users/${userId}`;
      const metadata = {
        userId,
        type: 'user_avatar',
        ...options.metadata
      };
      
      return await this.uploadFile(file, path, {
        ...options,
        metadata
      });
    } catch (error) {
      console.error('Error uploading user avatar:', error);
      throw error;
    }
  }

  // Upload artist profile image
  async uploadArtistImage(file, artistId, imageType = 'profile', options = {}) {
    try {
      const path = `artists/${artistId}`;
      const metadata = {
        artistId,
        imageType,
        type: 'artist_image',
        ...options.metadata
      };
      
      return await this.uploadFile(file, path, {
        ...options,
        metadata
      });
    } catch (error) {
      console.error('Error uploading artist image:', error);
      throw error;
    }
  }

  // Delete a file from Vercel Blob
  async deleteFile(url) {
    try {
      await del(url, { token: this.token });
      return { success: true };
    } catch (error) {
      console.error('Error deleting file from Vercel Blob:', error);
      throw this.handleBlobError(error);
    }
  }

  // List files in a directory (prefix)
  async listFiles(prefix = '') {
    try {
      const { blobs } = await list({
        prefix,
        token: this.token
      });

      return blobs.map(blob => ({
        name: blob.pathname.split('/').pop(),
        fullPath: blob.pathname,
        downloadURL: blob.url,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      }));
    } catch (error) {
      console.error('Error listing files:', error);
      throw this.handleBlobError(error);
    }
  }

  // Delete all files for a specific artwork
  async deleteArtworkFiles(artworkId) {
    try {
      const files = await this.listFiles(`artworks/${artworkId}`);
      const deletePromises = files.map(file => this.deleteFile(file.downloadURL));
      await Promise.all(deletePromises);
      
      return { success: true, deletedCount: files.length };
    } catch (error) {
      console.error('Error deleting artwork files:', error);
      throw error;
    }
  }

  // Delete all files for a specific user
  async deleteUserFiles(userId) {
    try {
      const files = await this.listFiles(`users/${userId}`);
      const deletePromises = files.map(file => this.deleteFile(file.downloadURL));
      await Promise.all(deletePromises);
      
      return { success: true, deletedCount: files.length };
    } catch (error) {
      console.error('Error deleting user files:', error);
      throw error;
    }
  }

  // Utility functions
  
  // Validate file type
  validateImageFile(file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']) {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
    return true;
  }

  // Validate file size
  validateFileSize(file, maxSizeInMB = 10) {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${maxSizeInMB}MB`);
    }
    return true;
  }

  // Create progress handler for uploads
  createProgressHandler(onProgress) {
    return (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress, event);
      }
    };
  }

  // Handle Vercel Blob errors
  handleBlobError(error) {
    let message = 'An error occurred with file storage';
    
    if (error.message) {
      if (error.message.includes('token')) {
        message = 'Storage authentication failed. Please check your configuration.';
      } else if (error.message.includes('size')) {
        message = 'File size exceeds the maximum allowed limit.';
      } else if (error.message.includes('type')) {
        message = 'File type is not supported.';
      } else {
        message = error.message;
      }
    }
    
    return new Error(message);
  }

  // Get file URL (for compatibility with Firebase Storage interface)
  async getDownloadURL(path) {
    // In Vercel Blob, the URL is the download URL
    // This method is for compatibility with Firebase Storage interface
    return path; // Assuming path is already a URL in this case
  }

  // Check if blob storage is configured
  isConfigured() {
    return !!this.token;
  }
}

// Create and export a singleton instance
export const vercelBlobService = new VercelBlobService();
export default vercelBlobService;