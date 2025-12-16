/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the app
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

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
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load user from localStorage on mount
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Verify token is still valid
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Verify token and get current user
   */
  const verifyToken = async (tokenToVerify) => {
    try {
      const userData = await authService.getCurrentUser(tokenToVerify);
      setUser(userData);
      setToken(tokenToVerify);
      setLoading(false);
    } catch (error) {
      // Token invalid, clear storage
      logout();
    }
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      const { user: userData, token: authToken } = await authService.login(email, password);
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Register user
   */
  const register = async (email, password, name) => {
    try {
      const { user: userData, token: authToken } = await authService.register(email, password, name);
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  /**
   * Get auth token for API calls
   */
  const getToken = () => {
    return token || localStorage.getItem('token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    getToken,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

