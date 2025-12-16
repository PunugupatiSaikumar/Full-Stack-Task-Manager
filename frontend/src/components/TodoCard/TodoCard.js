/**
 * Todo Card Component
 * 
 * Reusable card component for displaying individual tasks
 * Shows task details, status, priority, and action buttons
 */

import React from 'react';
import './TodoCard.css';

const TodoCard = ({ task, onEdit, onDelete }) => {
  /**
   * Get status badge class name
   */
  const getStatusClass = (status) => {
    const statusMap = {
      'pending': 'status-pending',
      'in-progress': 'status-in-progress',
      'completed': 'status-completed'
    };
    return statusMap[status] || 'status-pending';
  };

  /**
   * Get priority badge class name
   */
  const getPriorityClass = (priority) => {
    const priorityMap = {
      'low': 'priority-low',
      'medium': 'priority-medium',
      'high': 'priority-high'
    };
    return priorityMap[priority] || 'priority-medium';
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Format status text for display
   */
  const formatStatus = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  /**
   * Format priority text for display
   */
  const formatPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <div className="todo-card">
      <div className="todo-card-header">
        <h3 className="todo-card-title">{task.title}</h3>
        <div className="todo-card-badges">
          <span className={`badge ${getStatusClass(task.status)}`}>
            {formatStatus(task.status)}
          </span>
          <span className={`badge ${getPriorityClass(task.priority)}`}>
            {formatPriority(task.priority)}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="todo-card-description">{task.description}</p>
      )}

      {task.dueDate && (
        <div className="todo-card-due-date">
          <span className="due-date-label">Due:</span>
          <span className="due-date-value">{formatDate(task.dueDate)}</span>
        </div>
      )}

      <div className="todo-card-footer">
        <div className="todo-card-meta">
          <span className="meta-text">
            Created: {formatDate(task.createdAt)}
          </span>
        </div>
        <div className="todo-card-actions">
          <button
            className="btn-icon btn-edit"
            onClick={onEdit}
            aria-label="Edit task"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={onDelete}
            aria-label="Delete task"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;

