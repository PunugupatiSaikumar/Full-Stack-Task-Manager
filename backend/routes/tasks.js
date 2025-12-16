/**
 * Task Routes
 * 
 * REST API endpoints for task CRUD operations:
 * GET    /api/tasks       - Get all tasks
 * GET    /api/tasks/:id   - Get a single task by ID
 * POST   /api/tasks       - Create a new task
 * PUT    /api/tasks/:id   - Update an existing task
 * DELETE /api/tasks/:id   - Delete a task
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET all tasks (with optional query filters)
router.get('/', taskController.getAllTasks);

// GET a single task by ID
router.get('/:id', taskController.getTaskById);

// POST create a new task
router.post('/', taskController.createTask);

// PUT update an existing task
router.put('/:id', taskController.updateTask);

// DELETE remove a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;

