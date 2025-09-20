import {
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
  startAfter,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';

export const firestoreService = {
  // Collections
  collections: {
    users: 'users',
    artists: 'artists',
    artworks: 'artworks',
    categories: 'categories',
    testimonials: 'testimonials',
    favorites: 'favorites',
    orders: 'orders'
  },

  // Generic CRUD operations
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  },

  async getById(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  },

  async getAll(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (error) {
      console.error(`Error getting all documents from ${collectionName}:`, error);
      throw error;
    }
  },

  async update(collectionName, id, updates) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { id, ...updates };
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  },

  async delete(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  },

  // Query operations
  async queryCollection(collectionName, constraints = []) {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  },

  // Real-time listeners
  onCollectionChange(collectionName, callback, constraints = []) {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      
      return onSnapshot(q, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        callback(documents);
      });
    } catch (error) {
      console.error(`Error setting up listener for ${collectionName}:`, error);
      throw error;
    }
  },

  // Batch operations
  async batchWrite(operations) {
    try {
      const batch = writeBatch(db);
      
      operations.forEach(({ type, collectionName, id, data }) => {
        const docRef = id ? doc(db, collectionName, id) : doc(collection(db, collectionName));
        
        switch (type) {
          case 'create':
            batch.set(docRef, {
              ...data,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            break;
          case 'update':
            batch.update(docRef, {
              ...data,
              updatedAt: new Date().toISOString()
            });
            break;
          case 'delete':
            batch.delete(docRef);
            break;
          default:
            throw new Error(`Unknown batch operation type: ${type}`);
        }
      });

      await batch.commit();
      return { success: true };
    } catch (error) {
      console.error('Error in batch write operation:', error);
      throw error;
    }
  }
};

export default firestoreService;