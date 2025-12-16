/**
 * Task Service
 * 
 * Data access layer for task operations
 * Handles file-based storage (can be easily replaced with database)
 */

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Store tasks per user
const getDataFile = (userId) => path.join(__dirname, `../data/tasks_${userId}.json`);
const DATA_DIR = path.join(__dirname, '../data');

/**
 * Ensure data directory and file exist for a user
 */
const ensureDataFile = async (userId) => {
  try {
    const dataFile = getDataFile(userId);
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(dataFile);
    } catch {
      // File doesn't exist, create it with empty array
      await fs.writeFile(dataFile, JSON.stringify([], null, 2));
    }
  } catch (error) {
    throw new Error(`Failed to initialize data file: ${error.message}`);
  }
};

/**
 * Read tasks from file for a user
 */
const readTasks = async (userId) => {
  try {
    const dataFile = getDataFile(userId);
    await ensureDataFile(userId);
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read tasks: ${error.message}`);
  }
};

/**
 * Write tasks to file for a user
 */
const writeTasks = async (userId, tasks) => {
  try {
    const dataFile = getDataFile(userId);
    await ensureDataFile(userId);
    await fs.writeFile(dataFile, JSON.stringify(tasks, null, 2));
  } catch (error) {
    throw new Error(`Failed to write tasks: ${error.message}`);
  }
};

/**
 * Get all tasks with optional filters
 */
const getAllTasks = async (userId, filters = {}) => {
  try {
    let tasks = await readTasks(userId);
    
    // Apply filters
    if (filters.status) {
      tasks = tasks.filter(task => task.status === filters.status);
    }
    if (filters.priority) {
      tasks = tasks.filter(task => task.priority === filters.priority);
    }
    
    // Sort by createdAt (newest first)
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return tasks;
  } catch (error) {
    throw new Error(`Failed to get tasks: ${error.message}`);
  }
};

/**
 * Get a single task by ID
 */
const getTaskById = async (userId, id) => {
  try {
    const tasks = await readTasks(userId);
    return tasks.find(task => task.id === id);
  } catch (error) {
    throw new Error(`Failed to get task: ${error.message}`);
  }
};

/**
 * Create a new task
 */
const createTask = async (userId, taskData) => {
  try {
    const tasks = await readTasks(userId);
    
    const newTask = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    await writeTasks(userId, tasks);
    
    return newTask;
  } catch (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
};

/**
 * Update an existing task
 */
const updateTask = async (userId, id, updateData) => {
  try {
    const tasks = await readTasks(userId);
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }
    
    // Update task with new data, preserving id and timestamps
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updateData,
      id: tasks[taskIndex].id, // Preserve original ID
      createdAt: tasks[taskIndex].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString() // Update modification date
    };
    
    await writeTasks(userId, tasks);
    return tasks[taskIndex];
  } catch (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
};

/**
 * Delete a task
 */
const deleteTask = async (userId, id) => {
  try {
    const tasks = await readTasks(userId);
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === initialLength) {
      return false; // Task not found
    }
    
    await writeTasks(userId, filteredTasks);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};

