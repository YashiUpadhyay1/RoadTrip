// controllers/tripController.js
const asyncHandler = require('express-async-handler');
const Trip = require('../models/Trip');

// @desc    Get user trips
// @route   GET /api/trips
// @access  Private
const getTrips = asyncHandler(async (req, res) => {
  // FIX: We must filter the trips using the 'createdBy' field,
  // which holds the user's ID (req.user._id is set by the protect middleware).
  const trips = await Trip.find({ createdBy: req.user._id })
    .populate('createdBy', 'username'); 
    
  // Mongoose's find() returns an empty array if nothing is found, 
  // so no need for an explicit 'if (!trips)' check here.
  res.status(200).json(trips);
});

// @desc    Create new trip
// @route   POST /api/trips
// @access  Private
const createTrip = asyncHandler(async (req, res) => {
  const { title, description, locations } = req.body;
  if (!title || !locations || locations.length === 0) {
    res.status(400); 
    throw new Error('Please include a title and at least one location');
  }
  
  // Confirmed: Uses 'createdBy' field
  const trip = new Trip({ title, description, locations, createdBy: req.user._id });
  const createdTrip = await trip.save();
  res.status(201).json(createdTrip);
});

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  
  if (!trip) { 
    res.status(404); 
    throw new Error('Trip not found'); 
  }
  
  // Security check: Ensures only the creator can delete the trip
  if (trip.createdBy.toString() !== req.user._id.toString()) {
    res.status(403); 
    throw new Error('Not authorized to delete this trip'); 
  }
  
  await Trip.deleteOne({ _id: req.params.id });
  res.json({ message: 'Trip removed successfully' });
});

module.exports = { getTrips, createTrip, deleteTrip };