/**
 * @fileoverview The main entry point for the RoadTrip Planner backend server.
 * This file initializes the Express application, connects to MongoDB, sets up middleware (CORS, JSON parsing),
 * defines API routes, configures Swagger documentation, and starts the server.
 * @module index
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import custom modules
const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const setupSwagger = require('./swagger');

// Load environment variables from the .env file into process.env
dotenv.config();

// Initialize the Express application
const app = express();


// --- CORE MIDDLEWARE ---

/**
 * CORS (Cross-Origin Resource Sharing) configuration.
 * This is a crucial security feature that restricts which domains can make requests to this API.
 * The origin should be set to your live frontend URL to block requests from other websites.
 */
const corsOptions = {
  // FIX: Updated the origin to match the live Netlify frontend URL to resolve the CORS error.
  origin: 'https://benevolent-kleicha-a7a703.netlify.app', // 👈 Your actual Netlify URL
};
app.use(cors(corsOptions));

/**
 * Middleware to parse incoming requests with JSON payloads.
 * This is necessary to read data from the request body (req.body).
 */
app.use(express.json());


// --- DATABASE CONNECTION ---

/**
 * Asynchronously connects to the MongoDB database using the connection string
 * from the environment variables. If the connection fails, it logs the error
 * and terminates the application process.
 * @async
 * @function connectDB
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit process with a failure code
  }
};
connectDB();


// --- API ROUTES ---

/**
 * @route   GET /
 * @desc    Root endpoint to confirm the API is running.
 * @access  Public
 */
app.get('/', (req, res) => {
  res.send('🚗 RoadTrip Planner API is running...');
});

/**
 * @desc Mounts the authentication routes (e.g., /signup, /login) under the `/api/auth` path.
 */
app.use('/api/auth', authRoutes);

/**
 * @desc Mounts the trip management routes (e.g., /trips, /trips/:id) under the `/api/trips` path.
 */
app.use('/api/trips', tripRoutes);


// --- API DOCUMENTATION ---

/**
 * @desc Initializes and sets up Swagger for interactive API documentation.
 * The documentation UI will be available at the /api-docs endpoint.
 */
setupSwagger(app);


// --- GLOBAL ERROR HANDLER ---

/**
 * @desc Mounts the global error handling middleware.
 * This MUST be the last piece of middleware registered in the app stack
 * to ensure it catches all errors thrown from the routes defined above.
 */
app.use(errorHandler);


// --- SERVER INITIALIZATION ---

// Define the port for the server from environment variables, with a fallback to 5000 for local development
const PORT = process.env.PORT || 5000;

// Start the Express server and listen for incoming connections on the specified port
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
