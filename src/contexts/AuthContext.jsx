import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../firebase/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((userData) => {
      setUser(userData);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Firebase authentication methods

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signInUser(email, password);
      setUser(result.user);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const { name, email, password } = userData;
      const result = await authService.registerUser(email, password, { name });
      setUser(result.user);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.signOutUser();
      setUser(null);
    } catch (error) {
      setError(error.message);
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await authService.updateUserProfile(updates);
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signInWithGoogle();
      setUser(result.user);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);

    try {
      await authService.resetPassword(email);
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateUser,
    signInWithGoogle,
    resetPassword,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;