// models/Trip.js
const mongoose = require('mongoose');

// Define the schema for a single location/stop
// This sub-schema correctly defines the expected object structure from the frontend.
const locationSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    latitude: { 
        type: Number, // Coordinates must be stored as numbers
        required: true 
    },
    longitude: { 
        type: Number, // Coordinates must be stored as numbers
        required: true 
    },
}, { _id: false }); // Use _id: false if individual stops don't need their own unique MongoDB ID

const tripSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String 
    },
    // The main fix: 'locations' is now explicitly an array of 'locationSchema' objects.
    locations: { 
        type: [locationSchema], 
        required: true 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
