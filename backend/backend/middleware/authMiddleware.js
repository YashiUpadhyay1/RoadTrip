// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (removes 'Bearer ')
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token and get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user object (without password) to the request
      req.user = await User.findById(decoded.id).select('-password');
      
      // Move to the next middleware/controller
      next();
    } catch (error) {
      // If verification fails (e.g., token expired or invalid)
      res.status(401).json({ error: 'Not authorized, token failed' });
      // IMPORTANT: If we fail here, we must stop the function.
      return; 
    }
  }

  // If no token was found in the header at all
  if (!token) {
      res.status(401).json({ error: 'Not authorized, no token' });
      // CRITICAL FIX: Adding return to prevent sending headers twice or crashing the server
      return; 
  }
});

module.exports = { protect };