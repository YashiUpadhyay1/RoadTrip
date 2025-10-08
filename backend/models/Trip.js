/**
 * @fileoverview Mongoose model for Trip data.
 * Represents a road trip created by a user, containing multiple locations (stops) with coordinates.
 * @module models/Trip
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Location
 * @property {string} name - The name of the location/stop.
 * @property {number} latitude - The latitude coordinate of the location.
 * @property {number} longitude - The longitude coordinate of the location.
 */

/**
 * Sub-schema for individual trip locations (stops).
 * Each trip can contain multiple locations (e.g., cities or landmarks).
 *
 * @constant
 * @type {mongoose.Schema<Location>}
 */
const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  { _id: false } // Subdocuments don't need unique IDs
);

/**
 * Main Trip schema.
 * Each trip is associated with a registered user and includes
 * a title, description, and a series of location stops.
 *
 * @typedef {Object} Trip
 * @property {string} title - Title of the trip.
 * @property {string} [description] - Optional description of the trip.
 * @property {Location[]} locations - Array of locations (stops) in the trip.
 * @property {mongoose.Types.ObjectId} createdBy - Reference to the User who created the trip.
 * @property {Date} createdAt - Auto-generated creation date.
 * @property {Date} updatedAt - Auto-generated last update date.
 *
 * @constant
 * @type {mongoose.Schema<Trip>}
 */
const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    locations: {
      type: [locationSchema],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Mongoose model for Trip.
 * @type {mongoose.Model<Trip>}
 */
const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
