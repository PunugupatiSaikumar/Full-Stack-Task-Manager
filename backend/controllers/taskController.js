/**
 * Task Controller
 * 
 * Handles business logic for task operations
 * Validates input and delegates data operations to taskService
 */

const taskService = require('../services/taskService');
const { validateTask, validateTaskUpdate } = require('../utils/validation');

/**
 * Get all tasks
 * Supports optional query parameters: status, priority
 */
const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    
    const tasks = await taskService.getAllTasks(req.user.id, filters);
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single task by ID
 */
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(req.user.id, id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found`
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new task
 */
const createTask = async (req, res, next) => {
  try {
    // Validate input
    const validation = validateTask(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.errors
      });
    }
    
    const task = await taskService.createTask(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing task
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate input
    const validation = validateTaskUpdate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.errors
      });
    }
    
    const task = await taskService.updateTask(req.user.id, id, req.body);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found`
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await taskService.deleteTask(req.user.id, id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found`
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};

