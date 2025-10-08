// middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  
  // 1. Determine the status code.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // 2. Send the structured JSON response back to the client (frontend).
  res.json({
    // Send the error message (e.g., "Invalid Credentials" or "Trip not found")
    error: err.message,
    
    // Send the stack trace (debugging info) only if the server is NOT in production mode.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };