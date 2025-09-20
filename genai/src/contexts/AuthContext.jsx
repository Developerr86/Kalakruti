import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const savedUser = localStorage.getItem('artUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('artUser');
      }
    }
    setLoading(false);
  }, []);

  // Mock user database (in real app, this would be a backend API)
  const mockUsers = JSON.parse(localStorage.getItem('artUsers') || '[]');

  const saveUsers = (users) => {
    localStorage.setItem('artUsers', JSON.stringify(users));
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock database
      const existingUser = mockUsers.find(u => u.email === email);
      
      if (!existingUser) {
        throw new Error('No account found with this email address');
      }

      if (existingUser.password !== password) {
        throw new Error('Invalid password');
      }

      // Create user session
      const userSession = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        joinDate: existingUser.joinDate,
        avatar: existingUser.avatar,
        preferences: existingUser.preferences || {},
        lastLogin: new Date().toISOString()
      };

      setUser(userSession);
      localStorage.setItem('artUser', JSON.stringify(userSession));
      
      return { success: true, user: userSession };
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      const { name, email, password } = userData;

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In real app, this would be hashed
        joinDate: new Date().toISOString(),
        avatar: `https://images.unsplash.com/photo-1494790108755-2616c9044cb2?w=100&h=100&fit=crop&q=80`,
        preferences: {
          theme: 'light',
          notifications: true,
          newsletter: true
        }
      };

      // Save to mock database
      const updatedUsers = [...mockUsers, newUser];
      saveUsers(updatedUsers);

      // Create user session
      const userSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        joinDate: newUser.joinDate,
        avatar: newUser.avatar,
        preferences: newUser.preferences,
        lastLogin: new Date().toISOString()
      };

      setUser(userSession);
      localStorage.setItem('artUser', JSON.stringify(userSession));
      
      return { success: true, user: userSession };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('artUser');
  };

  const updateUser = (updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('artUser', JSON.stringify(updatedUser));

    // Update in mock database
    const users = JSON.parse(localStorage.getItem('artUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      saveUsers(users);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateUser,
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