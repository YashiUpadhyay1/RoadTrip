/**
 * @fileoverview Middleware for user authentication using JWT.
 * Verifies Bearer tokens, decodes user information, and attaches the user to the request object.
 * @module middleware/authMiddleware
 */

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * Protects private routes by verifying JWT tokens.
 *
 * @async
 * @function protect
 * @middleware
 * @param {import('express').Request} req - Express request object containing an Authorization header with Bearer token.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 *
 * @returns {Promise<void>} Proceeds to the next middleware/controller if the token is valid.
 *
 * @throws {Error} 401 - If no token is provided, or if the token is invalid/expired.
 *
 * @example
 * // Usage in route
 * const { protect } = require('../middleware/authMiddleware');
 * router.get('/trips', protect, getTrips);
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Bearer token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token and decode payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (without password) to the request object
      req.user = await User.findById(decoded.id).select('-password');

      // Continue to next middleware or controller
      return next();
    } catch (error) {
      // Handle expired or invalid tokens
      res.status(401).json({ error: 'Not authorized, token failed' });
      return;
    }
  }

  // Handle missing tokens
  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
    return;
  }
});

module.exports = { protect };
