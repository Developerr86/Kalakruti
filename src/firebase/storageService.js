import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  uploadBytesResumable,
  getMetadata
} from 'firebase/storage';
import { storage } from './config';

export const storageService = {
  // Upload a file to Firebase Storage
  async uploadFile(file, path, options = {}) {
    try {
      const { 
        onProgress = null, 
        metadata = {}, 
        useResumable = false 
      } = options;

      const storageRef = ref(storage, path);
      
      let uploadTask;
      
      if (useResumable) {
        // Use resumable upload for large files
        uploadTask = uploadBytesResumable(storageRef, file, metadata);
        
        return new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              // Track upload progress
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (onProgress) {
                onProgress(progress, snapshot);
              }
            },
            (error) => {
              console.error('Upload error:', error);
              reject(this.handleStorageError(error));
            },
            async () => {
              // Upload completed successfully
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const metadata = await getMetadata(uploadTask.snapshot.ref);
                resolve({
                  downloadURL,
                  metadata,
                  path,
                  name: file.name,
                  size: metadata.size
                });
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      } else {
        // Simple upload for smaller files
        const snapshot = await uploadBytes(storageRef, file, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const fileMetadata = await getMetadata(snapshot.ref);
        
        return {
          downloadURL,
          metadata: fileMetadata,
          path,
          name: file.name,
          size: fileMetadata.size
        };
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw this.handleStorageError(error);
    }
  },

  // Upload artwork image
  async uploadArtworkImage(file, artworkId, options = {}) {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const path = `artworks/${artworkId}/${fileName}`;
      
      return await this.uploadFile(file, path, {
        ...options,
        metadata: {
          customMetadata: {
            artworkId,
            uploadedAt: new Date().toISOString(),
            type: 'artwork_image'
          }
        }
      });
    } catch (error) {
      console.error('Error uploading artwork image:', error);
      throw error;
    }
  },

  // Upload user avatar
  async uploadUserAvatar(file, userId, options = {}) {
    try {
      const timestamp = Date.now();
      const fileName = `avatar_${timestamp}_${file.name}`;
      const path = `users/${userId}/${fileName}`;
      
      return await this.uploadFile(file, path, {
        ...options,
        metadata: {
          customMetadata: {
            userId,
            uploadedAt: new Date().toISOString(),
            type: 'user_avatar'
          }
        }
      });
    } catch (error) {
      console.error('Error uploading user avatar:', error);
      throw error;
    }
  },

  // Upload artist profile image
  async uploadArtistImage(file, artistId, imageType = 'profile', options = {}) {
    try {
      const timestamp = Date.now();
      const fileName = `${imageType}_${timestamp}_${file.name}`;
      const path = `artists/${artistId}/${fileName}`;
      
      return await this.uploadFile(file, path, {
        ...options,
        metadata: {
          customMetadata: {
            artistId,
            imageType,
            uploadedAt: new Date().toISOString(),
            type: 'artist_image'
          }
        }
      });
    } catch (error) {
      console.error('Error uploading artist image:', error);
      throw error;
    }
  },

  // Get download URL for a file
  async getDownloadURL(path) {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw this.handleStorageError(error);
    }
  },

  // Delete a file from storage
  async deleteFile(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw this.handleStorageError(error);
    }
  },

  // List all files in a directory
  async listFiles(path) {
    try {
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);
          
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            downloadURL,
            metadata,
            size: metadata.size,
            created: metadata.timeCreated,
            updated: metadata.updated
          };
        })
      );

      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw this.handleStorageError(error);
    }
  },

  // Get file metadata
  async getFileMetadata(path) {
    try {
      const storageRef = ref(storage, path);
      return await getMetadata(storageRef);
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw this.handleStorageError(error);
    }
  },

  // Delete all files for a specific artwork
  async deleteArtworkFiles(artworkId) {
    try {
      const path = `artworks/${artworkId}`;
      const files = await this.listFiles(path);
      
      const deletePromises = files.map(file => this.deleteFile(file.fullPath));
      await Promise.all(deletePromises);
      
      return { success: true, deletedCount: files.length };
    } catch (error) {
      console.error('Error deleting artwork files:', error);
      throw error;
    }
  },

  // Delete all files for a specific user
  async deleteUserFiles(userId) {
    try {
      const path = `users/${userId}`;
      const files = await this.listFiles(path);
      
      const deletePromises = files.map(file => this.deleteFile(file.fullPath));
      await Promise.all(deletePromises);
      
      return { success: true, deletedCount: files.length };
    } catch (error) {
      console.error('Error deleting user files:', error);
      throw error;
    }
  },

  // Utility functions
  
  // Validate file type
  validateImageFile(file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']) {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
    return true;
  },

  // Validate file size
  validateFileSize(file, maxSizeInMB = 10) {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${maxSizeInMB}MB`);
    }
    return true;
  },

  // Generate optimized image metadata
  generateImageMetadata(file, additionalMetadata = {}) {
    return {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000', // 1 year cache
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size.toString(),
        ...additionalMetadata
      }
    };
  },

  // Handle storage errors
  handleStorageError(error) {
    const errorCode = error.code;
    let message = 'An error occurred with file storage';

    switch (errorCode) {
      case 'storage/object-not-found':
        message = 'File not found';
        break;
      case 'storage/unauthorized':
        message = 'User does not have permission to access the file';
        break;
      case 'storage/canceled':
        message = 'Upload was canceled';
        break;
      case 'storage/unknown':
        message = 'Unknown error occurred, inspect error.serverResponse';
        break;
      case 'storage/invalid-format':
        message = 'Invalid file format';
        break;
      case 'storage/invalid-event-name':
        message = 'Invalid event name provided';
        break;
      case 'storage/invalid-url':
        message = 'Invalid URL provided';
        break;
      case 'storage/invalid-argument':
        message = 'Invalid argument provided';
        break;
      case 'storage/no-default-bucket':
        message = 'No default bucket found';
        break;
      case 'storage/cannot-slice-blob':
        message = 'Cannot slice blob, file might be corrupted';
        break;
      case 'storage/server-file-wrong-size':
        message = 'File size does not match server expectations';
        break;
      case 'storage/quota-exceeded':
        message = 'Storage quota exceeded';
        break;
      default:
        message = error.message || 'Storage operation failed';
    }

    return new Error(message);
  }
};

export default storageService;