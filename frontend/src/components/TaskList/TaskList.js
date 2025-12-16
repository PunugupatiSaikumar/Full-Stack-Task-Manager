/**
 * Task List Component
 * 
 * Displays a grid of task cards with loading and empty states
 */

import React from 'react';
import TodoCard from '../TodoCard/TodoCard';
import './TaskList.css';

const TaskList = ({ tasks, loading, onEdit, onDelete }) => {
  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  /**
   * Render empty state
   */
  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">📝</div>
        <h2>No tasks found</h2>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  /**
   * Render task grid
   */
  return (
    <div className="task-list">
      <div className="task-grid">
        {tasks.map((task) => (
          <TodoCard
            key={task.id}
            task={task}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;

