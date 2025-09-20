// Firebase error handling utilities

export class FirebaseError extends Error {
  constructor(message, code = null, originalError = null) {
    super(message);
    this.name = 'FirebaseError';
    this.code = code;
    this.originalError = originalError;
  }
}

export const handleFirebaseError = (error, context = '') => {
  console.error(`Firebase error in ${context}:`, error);
  
  // Extract meaningful error messages
  let message = 'An unexpected error occurred';
  
  if (error.code) {
    switch (error.code) {
      // Authentication errors
      case 'auth/user-not-found':
        message = 'No account found with this email address';
        break;
      case 'auth/wrong-password':
        message = 'Invalid password';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists';
        break;
      case 'auth/weak-password':
        message = 'Password must be at least 6 characters long';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your internet connection';
        break;
      
      // Firestore errors
      case 'firestore/permission-denied':
        message = 'You do not have permission to access this data';
        break;
      case 'firestore/not-found':
        message = 'The requested data was not found';
        break;
      case 'firestore/already-exists':
        message = 'This data already exists';
        break;
      case 'firestore/resource-exhausted':
        message = 'Too many requests. Please try again later';
        break;
      case 'firestore/failed-precondition':
        message = 'Operation failed due to data constraints';
        break;
      case 'firestore/aborted':
        message = 'Operation was aborted due to a conflict';
        break;
      case 'firestore/out-of-range':
        message = 'Operation was attempted past the valid range';
        break;
      case 'firestore/unimplemented':
        message = 'Operation is not implemented or supported';
        break;
      case 'firestore/internal':
        message = 'Internal server error. Please try again later';
        break;
      case 'firestore/unavailable':
        message = 'Service is currently unavailable. Please try again later';
        break;
      case 'firestore/data-loss':
        message = 'Unrecoverable data loss or corruption';
        break;
      
      // Storage errors
      case 'storage/object-not-found':
        message = 'File not found';
        break;
      case 'storage/unauthorized':
        message = 'You do not have permission to access this file';
        break;
      case 'storage/canceled':
        message = 'Upload was canceled';
        break;
      case 'storage/unknown':
        message = 'Unknown storage error occurred';
        break;
      case 'storage/invalid-format':
        message = 'Invalid file format';
        break;
      case 'storage/quota-exceeded':
        message = 'Storage quota exceeded';
        break;
      
      // Network errors
      case 'unavailable':
        message = 'Service is temporarily unavailable. Please try again later';
        break;
      case 'deadline-exceeded':
        message = 'Request timed out. Please try again';
        break;
      
      default:
        message = error.message || 'An unexpected error occurred';
    }
  } else if (error.message) {
    message = error.message;
  }
  
  return new FirebaseError(message, error.code, error);
};

// Retry utility for transient errors
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry for certain error types
      if (error.code && [
        'auth/user-not-found',
        'auth/wrong-password',
        'auth/email-already-in-use',
        'auth/invalid-email',
        'firestore/permission-denied',
        'firestore/not-found',
        'storage/unauthorized'
      ].includes(error.code)) {
        throw error;
      }
      
      // Don't retry on final attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError;
};

// Connection status monitoring
export class ConnectionMonitor {
  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = new Set();
    
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }
  
  onConnectionChange(callback) {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }
  
  notifyListeners(isOnline) {
    this.listeners.forEach(callback => {
      try {
        callback(isOnline);
      } catch (error) {
        console.error('Error in connection status listener:', error);
      }
    });
  }
}

// Global connection monitor instance
export const connectionMonitor = new ConnectionMonitor();

// Operation queue for offline support
export class OperationQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    
    // Process queue when coming back online
    connectionMonitor.onConnectionChange((isOnline) => {
      if (isOnline && this.queue.length > 0) {
        this.processQueue();
      }
    });
  }
  
  addOperation(operation, context = '') {
    this.queue.push({
      operation,
      context,
      timestamp: Date.now(),
      retries: 0
    });
    
    if (connectionMonitor.isOnline) {
      this.processQueue();
    }
  }
  
  async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }
    
    this.processing = true;
    
    while (this.queue.length > 0 && connectionMonitor.isOnline) {
      const item = this.queue.shift();
      
      try {
        await item.operation();
        console.log(`Successfully processed queued operation: ${item.context}`);
      } catch (error) {
        console.error(`Failed to process queued operation: ${item.context}`, error);
        
        // Retry failed operations up to 3 times
        if (item.retries < 3) {
          item.retries++;
          this.queue.unshift(item);
        } else {
          console.error(`Giving up on operation after 3 retries: ${item.context}`);
        }
      }
    }
    
    this.processing = false;
  }
  
  clearQueue() {
    this.queue = [];
  }
  
  getQueueSize() {
    return this.queue.length;
  }
}

// Global operation queue instance
export const operationQueue = new OperationQueue();

// Utility to wrap Firebase operations with error handling and retry logic
export const withErrorHandling = (operation, context = '', useRetry = true) => {
  return async (...args) => {
    const wrappedOperation = () => operation(...args);
    
    try {
      if (useRetry) {
        return await retryOperation(wrappedOperation);
      } else {
        return await wrappedOperation();
      }
    } catch (error) {
      throw handleFirebaseError(error, context);
    }
  };
};

// Utility to queue operations when offline
export const withOfflineSupport = (operation, context = '') => {
  return async (...args) => {
    if (!connectionMonitor.isOnline) {
      operationQueue.addOperation(() => operation(...args), context);
      throw new FirebaseError('Operation queued for when connection is restored');
    }
    
    return await operation(...args);
  };
};

export default {
  FirebaseError,
  handleFirebaseError,
  retryOperation,
  connectionMonitor,
  operationQueue,
  withErrorHandling,
  withOfflineSupport
};