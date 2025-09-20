// Firebase services exports
export { auth, db, storage } from './config';
export { authService } from './authService';
export { firestoreService } from './firestoreService';
export { dataService } from './dataService';
export { storageService } from './storageService';
export { seedFirestore, seedCategories, seedArtists, seedArtworks, seedTestimonials } from './seedData';
export { 
  FirebaseError, 
  handleFirebaseError, 
  retryOperation, 
  connectionMonitor, 
  operationQueue, 
  withErrorHandling, 
  withOfflineSupport 
} from './errorHandler';

// Re-export Firebase SDK functions that might be needed
export {
  // Firestore
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';

export {
  // Auth
  onAuthStateChanged,
  signOut,
  updateProfile
} from 'firebase/auth';

export {
  // Storage
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';