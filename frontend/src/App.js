/**
 * Main App Component
 * 
 * Root component that manages global state and renders the task manager interface
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { setAuthToken } from './services/taskService';
import Header from './components/Header/Header';
import TaskList from './components/TaskList/TaskList';
import TaskFormModal from './components/Modal/TaskFormModal';
import Login from './components/Login/Login';
import { taskService } from './services/taskService';

const AppContent = () => {
  const { isAuthenticated, loading: authLoading, getToken, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status: '', priority: '' });

  /**
   * Set auth token for API calls
   */
  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuthToken(token);
    } else {
      setAuthToken(null);
    }
  }, [getToken, isAuthenticated]);

  /**
   * Fetch all tasks from the API
   */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAllTasks(filter);
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load tasks on component mount and when filter changes
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [filter, isAuthenticated]);

  /**
   * Show login if not authenticated
   */
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  /**
   * Handle creating a new task
   */
  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      await fetchTasks();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to create task');
      throw err; // Re-throw to let modal handle it
    }
  };

  /**
   * Handle updating an existing task
   */
  const handleUpdateTask = async (id, taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      await fetchTasks();
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      setError(err.message || 'Failed to update task');
      throw err; // Re-throw to let modal handle it
    }
  };

  /**
   * Handle deleting a task
   */
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await taskService.deleteTask(id);
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  /**
   * Open modal for creating a new task
   */
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  /**
   * Open modal for editing an existing task
   */
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  /**
   * Close modal and reset editing state
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="App">
      <Header 
        onAddTask={handleOpenCreateModal}
        filter={filter}
        onFilterChange={setFilter}
        onLogout={logout}
      />
      
      <main className="main-content">
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}
        
        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
        />
      </main>

      {isModalOpen && (
        <TaskFormModal
          task={editingTask}
          onClose={handleCloseModal}
          onSubmit={editingTask 
            ? (data) => handleUpdateTask(editingTask.id, data)
            : handleCreateTask
          }
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

