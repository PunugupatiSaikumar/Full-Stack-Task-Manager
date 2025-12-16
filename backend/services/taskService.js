/**
 * Task Service
 * 
 * Data access layer for task operations
 * Handles file-based storage (can be easily replaced with database)
 */

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/tasks.json');
const DATA_DIR = path.dirname(DATA_FILE);

/**
 * Ensure data directory and file exist
 */
const ensureDataFile = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      // File doesn't exist, create it with empty array
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    throw new Error(`Failed to initialize data file: ${error.message}`);
  }
};

/**
 * Read tasks from file
 */
const readTasks = async () => {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read tasks: ${error.message}`);
  }
};

/**
 * Write tasks to file
 */
const writeTasks = async (tasks) => {
  try {
    await ensureDataFile();
    await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    throw new Error(`Failed to write tasks: ${error.message}`);
  }
};

/**
 * Get all tasks with optional filters
 */
const getAllTasks = async (filters = {}) => {
  try {
    let tasks = await readTasks();
    
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
const getTaskById = async (id) => {
  try {
    const tasks = await readTasks();
    return tasks.find(task => task.id === id);
  } catch (error) {
    throw new Error(`Failed to get task: ${error.message}`);
  }
};

/**
 * Create a new task
 */
const createTask = async (taskData) => {
  try {
    const tasks = await readTasks();
    
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
    await writeTasks(tasks);
    
    return newTask;
  } catch (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
};

/**
 * Update an existing task
 */
const updateTask = async (id, updateData) => {
  try {
    const tasks = await readTasks();
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
    
    await writeTasks(tasks);
    return tasks[taskIndex];
  } catch (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
};

/**
 * Delete a task
 */
const deleteTask = async (id) => {
  try {
    const tasks = await readTasks();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === initialLength) {
      return false; // Task not found
    }
    
    await writeTasks(filteredTasks);
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

