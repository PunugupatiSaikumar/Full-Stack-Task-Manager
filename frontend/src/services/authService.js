/**
 * Authentication Service
 * 
 * Handles authentication API calls
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/auth';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Handle API errors
 */
const handleError = (error) => {
  if (error.response) {
    const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    throw new Error('Unable to connect to server. Please check your connection.');
  } else {
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

/**
 * Register a new user
 */
export const register = async (email, password, name) => {
  try {
    const response = await apiClient.post('/register', { email, password, name });
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Login user
 */
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/login', { email, password });
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get current user info
 */
export const getCurrentUser = async (token) => {
  try {
    const response = await apiClient.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const authService = {
  register,
  login,
  getCurrentUser
};

