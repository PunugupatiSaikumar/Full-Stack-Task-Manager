/**
 * Task Service
 * 
 * API client for task operations
 * Handles HTTP requests, error handling, and response parsing
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/tasks';

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Set authorization token for requests
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Handle API errors and extract meaningful error messages
 */
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    // Request was made but no response received
    throw new Error('Unable to connect to server. Please check your connection.');
  } else {
    // Something else happened
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

/**
 * Get all tasks with optional filters
 */
export const getAllTasks = async (filters = {}) => {
  try {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    
    const response = await apiClient.get('/', { params });
    return response.data.data || response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (id) => {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Create a new task
 */
export const createTask = async (taskData) => {
  try {
    const response = await apiClient.post('/', taskData);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (id, taskData) => {
  try {
    const response = await apiClient.put(`/${id}`, taskData);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (id) => {
  try {
    await apiClient.delete(`/${id}`);
    return true;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Export service object for convenience
 */
export const taskService = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

