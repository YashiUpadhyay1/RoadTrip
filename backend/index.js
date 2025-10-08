// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import middleware and routes
const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
connectDB();

// Root Route
app.get('/', (req, res) => {
  res.send('🚗 RoadTrip Planner API is running...');
});

// Primary Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// Swagger Documentation
const setupSwagger = require('./swagger');
setupSwagger(app); // 👈 Add Swagger setup right here

// Global Error Handler (MUST be after all routes)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
