import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Register a new user
  async registerUser(email, password, userData) {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: userData.name
      });

      // Create user document in Firestore
      const userDoc = {
        uid: user.uid,
        name: userData.name,
        email: user.email,
        joinDate: new Date().toISOString(),
        avatar: userData.avatar || `https://images.unsplash.com/photo-1494790108755-2616c9044cb2?w=100&h=100&fit=crop&q=80`,
        preferences: {
          theme: 'light',
          notifications: true,
          newsletter: true
        },
        lastLogin: new Date().toISOString(),
        isActive: true
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);

      return {
        success: true,
        user: {
          id: user.uid,
          name: userData.name,
          email: user.email,
          ...userDoc
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Sign in existing user
  async signInUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Update last login
        await updateDoc(userDocRef, {
          lastLogin: new Date().toISOString()
        });

        return {
          success: true,
          user: {
            id: user.uid,
            name: user.displayName || userData.name,
            email: user.email,
            ...userData,
            lastLogin: new Date().toISOString()
          }
        };
      } else {
        // If user doc doesn't exist, create it
        const userData = {
          uid: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          joinDate: new Date().toISOString(),
          avatar: `https://images.unsplash.com/photo-1494790108755-2616c9044cb2?w=100&h=100&fit=crop&q=80`,
          preferences: {
            theme: 'light',
            notifications: true,
            newsletter: true
          },
          lastLogin: new Date().toISOString(),
          isActive: true
        };

        await setDoc(userDocRef, userData);

        return {
          success: true,
          user: {
            id: user.uid,
            ...userData
          }
        };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      let userData;
      if (userDoc.exists()) {
        userData = userDoc.data();
        // Update last login
        await updateDoc(userDocRef, {
          lastLogin: new Date().toISOString()
        });
      } else {
        // Create new user document
        userData = {
          uid: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          joinDate: new Date().toISOString(),
          avatar: user.photoURL || `https://images.unsplash.com/photo-1494790108755-2616c9044cb2?w=100&h=100&fit=crop&q=80`,
          preferences: {
            theme: 'light',
            notifications: true,
            newsletter: true
          },
          lastLogin: new Date().toISOString(),
          isActive: true,
          authProvider: 'google'
        };

        await setDoc(userDocRef, userData);
      }

      return {
        success: true,
        user: {
          id: user.uid,
          name: user.displayName || userData.name,
          email: user.email,
          ...userData,
          lastLogin: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Google sign in error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Sign out user
  async signOutUser() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Update user profile
  async updateUserProfile(updates) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      // Update Firebase Auth profile if name is being updated
      if (updates.name && updates.name !== user.displayName) {
        await updateProfile(user, {
          displayName: updates.name
        });
      }

      // Update Firestore document
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Get current user data
  async getCurrentUserData() {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: user.uid,
          name: user.displayName || userData.name,
          email: user.email,
          ...userData
        };
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Auth state observer
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await this.getCurrentUserData();
        callback(userData);
      } else {
        callback(null);
      }
    });
  },

  // Handle authentication errors
  handleAuthError(error) {
    const errorCode = error.code;
    let message = 'An error occurred during authentication';

    switch (errorCode) {
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
      case 'auth/popup-closed-by-user':
        message = 'Sign-in popup was closed';
        break;
      case 'auth/popup-blocked':
        message = 'Sign-in popup was blocked by browser';
        break;
      default:
        message = error.message || 'Authentication failed';
    }

    return new Error(message);
  }
};

export default authService;