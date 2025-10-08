/**
 * @fileoverview Controller functions for user authentication.
 * Handles user signup, login, and JWT token generation.
 * @module controllers/authController
 */

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Generates a JWT authentication token for a user.
 * @function
 * @param {string} id - The MongoDB user ID.
 * @returns {string} A signed JWT token valid for 30 days.
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

/**
 * Registers a new user.
 *
 * @route POST /api/auth/signup
 * @access Public
 *
 * @async
 * @function signupUser
 * @param {import('express').Request} req - Express request object containing `username`, `email`, and `password` in the body.
 * @param {import('express').Response} res - Express response object.
 *
 * @returns {void} Sends a JSON response containing the created user's ID, username, email, and JWT token.
 *
 * @throws {Error} 400 - If required fields are missing or user already exists.
 * @throws {Error} 500 - If user creation fails.
 */
const signupUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ username, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * Logs in an existing user.
 *
 * @route POST /api/auth/login
 * @access Public
 *
 * @async
 * @function loginUser
 * @param {import('express').Request} req - Express request object containing `email` and `password` in the body.
 * @param {import('express').Response} res - Express response object.
 *
 * @returns {void} Sends a JSON response containing the user's ID, username, email, and JWT token.
 *
 * @throws {Error} 401 - If credentials are invalid.
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = { signupUser, loginUser };