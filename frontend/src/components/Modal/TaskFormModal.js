/**
 * Task Form Modal Component
 * 
 * Reusable modal component for creating and editing tasks
 * Includes form validation and error handling
 */

import React, { useState, useEffect } from 'react';
import FormInput from '../FormInput/FormInput';
import './TaskFormModal.css';

const TaskFormModal = ({ task, onClose, onSubmit }) => {
  const isEditing = !!task;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /**
   * Initialize form data when editing
   */
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    }
  }, [task]);

  /**
   * Handle input change
   */
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Validate form data
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (formData.dueDate && !isValidDate(formData.dueDate)) {
      newErrors.dueDate = 'Please enter a valid date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Check if date is valid
   */
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        dueDate: formData.dueDate || null
      };
      await onSubmit(submitData);
    } catch (error) {
      // Error is handled by parent component
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle modal backdrop click
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <FormInput
            label="Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={(value) => handleChange('title', value)}
            error={errors.title}
            required
            placeholder="Enter task title"
          />

          <FormInput
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            error={errors.description}
            placeholder="Enter task description (optional)"
            rows={4}
          />

          <div className="form-row">
            <FormInput
              label="Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={(value) => handleChange('status', value)}
              error={errors.status}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' }
              ]}
            />

            <FormInput
              label="Priority"
              name="priority"
              type="select"
              value={formData.priority}
              onChange={(value) => handleChange('priority', value)}
              error={errors.priority}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ]}
            />
          </div>

          <FormInput
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(value) => handleChange('dueDate', value)}
            error={errors.dueDate}
            placeholder="Select due date (optional)"
          />

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;

