// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase config object
// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyATN2l5cpBADiUhV3i9V198552WkKIjd7g",
  authDomain: "genai-hackathon-8b309.firebaseapp.com",
  projectId: "genai-hackathon-8b309",
  storageBucket: "genai-hackathon-8b309.firebasestorage.app",
  messagingSenderId: "1056854936497",
  appId: "1:1056854936497:web:55f28a3a66fd2bcce08b90",
  measurementId: "G-DPEZQZLCBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the app instance
export default app;
