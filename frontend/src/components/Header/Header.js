/**
 * Header Component
 * 
 * Application header with title, add task button, and filter controls
 */

import React from 'react';
import './Header.css';

const Header = ({ onAddTask, filter, onFilterChange }) => {
  /**
   * Handle filter change
   */
  const handleFilterChange = (type, value) => {
    onFilterChange({
      ...filter,
      [type]: value === 'all' ? '' : value
    });
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>📋 Task Manager</h1>
          <p>Organize your tasks efficiently</p>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={onAddTask}
          aria-label="Add new task"
        >
          + Add Task
        </button>
      </div>

      <div className="header-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={filter.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority-filter">Filter by Priority:</label>
          <select
            id="priority-filter"
            value={filter.priority || 'all'}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;

