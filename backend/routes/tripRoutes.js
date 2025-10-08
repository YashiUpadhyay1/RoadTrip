/**
 * @fileoverview Routes for managing road trips.
 * Provides endpoints for fetching, creating, and deleting trips.
 * All routes are protected and require valid JWT authentication.
 * @module routes/tripRoutes
 */

const express = require('express');
const router = express.Router();
const { getTrips, createTrip, deleteTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route GET /api/trips
 * @group Trips
 * @summary Fetch all trips created by the logged-in user.
 * @description
 * Requires JWT authentication.
 * Returns an array of trips created by the authenticated user.
 *
 * @security BearerAuth
 * @returns {Array<object>} 200 - List of trips.
 * @returns {string} 200._id - Trip ID.
 * @returns {string} 200.title - Trip title.
 * @returns {string} 200.description - Trip description.
 * @returns {Array<object>} 200.locations - List of locations with coordinates.
 * @returns {Error} 401 - Unauthorized (missing or invalid token).
 */
router.get('/', protect, getTrips);

/**
 * @route POST /api/trips
 * @group Trips
 * @summary Create a new trip.
 * @description
 * Accepts `title`, `description`, and an array of `locations`.
 * Each location includes `name`, `latitude`, and `longitude`.
 *
 * @security BearerAuth
 * @example
 * Request body:
 * {
 *   "title": "European Adventure",
 *   "description": "Backpacking across Europe",
 *   "locations": [
 *     { "name": "Paris", "latitude": 48.8566, "longitude": 2.3522 },
 *     { "name": "Rome", "latitude": 41.9028, "longitude": 12.4964 }
 *   ]
 * }
 *
 * @returns {object} 201 - Created trip.
 * @returns {string} 201._id - Trip ID.
 * @returns {string} 201.title - Trip title.
 * @returns {Array<object>} 201.locations - Array of location objects.
 * @returns {Error} 400 - Missing title or locations.
 * @returns {Error} 401 - Unauthorized.
 */
router.post('/', protect, createTrip);

/**
 * @route DELETE /api/trips/:id
 * @group Trips
 * @summary Delete a trip by ID.
 * @description
 * Deletes the trip if the authenticated user is its creator.
 *
 * @security BearerAuth
 * @param {string} id.path.required - Trip ID.
 * @returns {object} 200 - Confirmation message.
 * @returns {Error} 403 - Not authorized to delete this trip.
 * @returns {Error} 404 - Trip not found.
 */
router.delete('/:id', protect, deleteTrip);

module.exports = router;
