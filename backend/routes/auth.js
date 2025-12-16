/**
 * Authentication Routes
 * 
 * POST /api/auth/register - Register a new user
 * POST /api/auth/login    - Login user and get token
 * GET  /api/auth/me      - Get current user info
 */

const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { generateToken } = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');

/**
 * Register a new user
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    // Create user
    const user = await userService.createUser(email, password, name);
    
    // Generate token
    const token = generateToken(user.id, user.email);
    
    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * Login user
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    // Verify credentials
    const user = await userService.verifyPassword(email, password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // Generate token
    const token = generateToken(user.id, user.email);
    
    res.json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get current user info (protected route)
 */
router.get('/me', authenticate, async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = router;

