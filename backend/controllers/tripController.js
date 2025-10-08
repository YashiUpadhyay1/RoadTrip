/**
 * @fileoverview Controller functions for handling trip operations.
 * Includes creating, fetching, and deleting road trips for authenticated users.
 * @module controllers/tripController
 */

const asyncHandler = require('express-async-handler');
const Trip = require('../models/Trip');

/**
 * Get all trips created by the authenticated user.
 *
 * @async
 * @function getTrips
 * @route GET /api/trips
 * @access Private
 *
 * @param {import('express').Request} req - Express request object with user data from `protect` middleware.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Responds with a JSON array of trips.
 *
 * @throws {Error} 401 - If user is not authenticated.
 */
const getTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ createdBy: req.user._id })
    .populate('createdBy', 'username');
  res.status(200).json(trips);
});

/**
 * Create a new trip for the authenticated user.
 *
 * @async
 * @function createTrip
 * @route POST /api/trips
 * @access Private
 *
 * @param {import('express').Request} req - Express request containing `title`, `description`, and `locations`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Responds with the created trip object.
 *
 * @throws {Error} 400 - If required fields are missing.
 */
const createTrip = asyncHandler(async (req, res) => {
  const { title, description, locations } = req.body;

  if (!title || !locations || locations.length === 0) {
    res.status(400);
    throw new Error('Please include a title and at least one location');
  }

  const trip = new Trip({
    title,
    description,
    locations,
    createdBy: req.user._id,
  });

  const createdTrip = await trip.save();
  res.status(201).json(createdTrip);
});

/**
 * Delete a trip by ID (only allowed for its creator).
 *
 * @async
 * @function deleteTrip
 * @route DELETE /api/trips/:id
 * @access Private
 *
 * @param {import('express').Request} req - Express request containing trip ID in params.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Responds with a success message on deletion.
 *
 * @throws {Error} 404 - If the trip does not exist.
 * @throws {Error} 403 - If the user is not authorized to delete this trip.
 */
const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }

  if (trip.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this trip');
  }

  await Trip.deleteOne({ _id: req.params.id });
  res.json({ message: 'Trip removed successfully' });
});

module.exports = { getTrips, createTrip, deleteTrip };
