// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Import the new error handler (Bringing in the Clean-Up Crew)
const { errorHandler } = require('./middleware/errorMiddleware'); 
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    // Connect to MongoDB. Note: Deprecated options removed for cleaner code.
    await mongoose.connect(process.env.MONGO_URI); 
    console.log('MongoDB Connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
connectDB();

app.get('/', (req, res) => {
  res.send('RoadTrip Planner API is running...');
});

// Primary Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// 2. Apply the Global Error Handler (Placing the Clean-Up Crew at the exit)
// This MUST be after all app.use() calls for routes.
app.use(errorHandler); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));