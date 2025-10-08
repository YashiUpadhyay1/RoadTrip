/**
 * @fileoverview Authentication routes for user registration and login.
 * Defines Express routes for signing up and logging in users.
 * @module routes/authRoutes
 */

const express = require('express');
const router = express.Router();
const { signupUser, loginUser } = require('../controllers/authController');

/**
 * @route POST /api/auth/signup
 * @group Authentication
 * @summary Registers a new user in the system.
 * @description
 * Accepts `username`, `email`, and `password` in the request body.
 * Returns a JWT token upon successful registration.
 *
 * @example
 * Request body:
 * {
 *   "username": "JohnDoe",
 *   "email": "john@example.com",
 *   "password": "securePassword123"
 * }
 *
 * @returns {object} 201 - User created successfully.
 * @returns {string} ._id - The user's unique MongoDB ID.
 * @returns {string} .username - The registered username.
 * @returns {string} .email - The user's email.
 * @returns {string} .token - JWT for authentication.
 * @returns {Error} 400 - Missing fields or user already exists.
 */
router.post('/signup', signupUser);

/**
 * @route POST /api/auth/login
 * @group Authentication
 * @summary Logs in a registered user.
 * @description
 * Accepts `email` and `password` in the body.
 * Returns user info and a new JWT token if credentials are valid.
 *
 * @example
 * Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "securePassword123"
 * }
 *
 * @returns {object} 200 - User logged in successfully.
 * @returns {string} ._id - The user's MongoDB ID.
 * @returns {string} .username - Username.
 * @returns {string} .email - User's email.
 * @returns {string} .token - Authentication token.
 * @returns {Error} 401 - Invalid credentials.
 */
router.post('/login', loginUser);

module.exports = router;
