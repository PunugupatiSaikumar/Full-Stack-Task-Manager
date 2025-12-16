/**
 * Validation Utilities
 * 
 * Input validation functions for task data
 */

/**
 * Validate task creation data
 */
const validateTask = (data) => {
  const errors = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (data.title && data.title.length > 200) {
    errors.push('Title must be 200 characters or less');
  }
  
  if (data.description && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }
  
  if (data.status && !['pending', 'in-progress', 'completed'].includes(data.status)) {
    errors.push('Status must be one of: pending, in-progress, completed');
  }
  
  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Priority must be one of: low, medium, high');
  }
  
  if (data.dueDate && !isValidDate(data.dueDate)) {
    errors.push('Due date must be a valid ISO date string');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

/**
 * Validate task update data (all fields optional)
 */
const validateTaskUpdate = (data) => {
  const errors = [];
  
  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title must be a non-empty string');
    }
    if (data.title.length > 200) {
      errors.push('Title must be 200 characters or less');
    }
  }
  
  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }
  
  if (data.status !== undefined && !['pending', 'in-progress', 'completed'].includes(data.status)) {
    errors.push('Status must be one of: pending, in-progress, completed');
  }
  
  if (data.priority !== undefined && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Priority must be one of: low, medium, high');
  }
  
  if (data.dueDate !== undefined && data.dueDate !== null && !isValidDate(data.dueDate)) {
    errors.push('Due date must be a valid ISO date string or null');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

/**
 * Check if a string is a valid date
 */
const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

module.exports = {
  validateTask,
  validateTaskUpdate
};

