/**
 * @fileoverview Global error-handling middleware for Express.
 * Catches and formats all thrown errors across routes and controllers.
 * @module middleware/errorMiddleware
 */

/**
 * Express error-handling middleware.
 *
 * Ensures that all thrown or passed errors are returned as structured JSON responses.
 * In production mode, stack traces are hidden to prevent information leakage.
 *
 * @function errorHandler
 * @middleware
 * @param {Error} err - The error object thrown in controllers or middleware.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 *
 * @returns {void} Sends a JSON response with error message and optional stack trace.
 *
 * @example
 * // Usage in main server (index.js)
 * const { errorHandler } = require('./middleware/errorMiddleware');
 * app.use(errorHandler);
 */
const errorHandler = (err, req, res, next) => {
  // Determine status code (default to 500 if not set)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Send structured error response
  res.json({
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
