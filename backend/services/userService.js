/**
 * User Service
 * 
 * Handles user authentication and user data operations
 */

const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/users.json');
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
    throw new Error(`Failed to initialize users file: ${error.message}`);
  }
};

/**
 * Read users from file
 */
const readUsers = async () => {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read users: ${error.message}`);
  }
};

/**
 * Write users to file
 */
const writeUsers = async (users) => {
  try {
    await ensureDataFile();
    await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    throw new Error(`Failed to write users: ${error.message}`);
  }
};

/**
 * Find user by email
 */
const findUserByEmail = async (email) => {
  try {
    const users = await readUsers();
    return users.find(user => user.email === email.toLowerCase());
  } catch (error) {
    throw new Error(`Failed to find user: ${error.message}`);
  }
};

/**
 * Find user by ID
 */
const findUserById = async (id) => {
  try {
    const users = await readUsers();
    const user = users.find(user => user.id === id);
    if (user) {
      // Remove password from returned user object
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  } catch (error) {
    throw new Error(`Failed to find user: ${error.message}`);
  }
};

/**
 * Create a new user
 */
const createUser = async (email, password, name) => {
  try {
    const users = await readUsers();
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email.toLowerCase());
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = {
      id: uuidv4(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeUsers(users);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

/**
 * Verify user password
 */
const verifyPassword = async (email, password) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw new Error(`Failed to verify password: ${error.message}`);
  }
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword
};

