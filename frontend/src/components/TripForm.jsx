/**
 * @fileoverview A form component for creating new road trips.
 * Includes input for title, description, and a dynamic list of locations.
 * Features geocoding to convert location names into geographic coordinates.
 * @module components/TripForm
 */

import React, { useState } from "react";
import axios from 'axios';
import { Plus, XCircle, Loader2, MapPin } from "lucide-react";

// OpenStreetMap Nominatim Geocoding API endpoint
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search?format=json&limit=1';

/**
 * Represents a single stop or location on a road trip.
 * @typedef {object} Location
 * @property {string} name - The user-provided name of the location.
 * @property {number} latitude - The geographic latitude of the location.
 * @property {number} longitude - The geographic longitude of the location.
 */

/**
 * Represents the complete data for a new trip, ready for submission.
 * @typedef {object} TripData
 * @property {string} title - The title of the trip.
 * @property {string} description - An optional description for the trip.
 * @property {Array<Location>} locations - An array of location objects for the trip route.
 */

/**
 * Renders a form to create a new road trip. The user can add a title,
 * description, and a list of locations. Each location is geocoded using the
 * OpenStreetMap Nominatim API to get its coordinates before being added to the trip.
 *
 * @param {object} props - The component's props.
 * @param {(tripData: TripData) => Promise<void>} props.onSubmit - The async callback function to execute upon successful form submission. It receives the complete trip data.
 * @param {() => void} props.onCancel - The callback function to execute when the user clicks the "Cancel" button.
 */
const TripForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locations, setLocations] = useState([]);
  const [currentLocationName, setCurrentLocationName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Geocodes the current location name using the Nominatim API and adds it to the locations list.
   * @param {React.MouseEvent | React.KeyboardEvent} e - The event object.
   */
  const handleGeocodeAndAddLocation = async (e) => {
    e.preventDefault();
    setError(null);
    const nameToSearch = currentLocationName.trim();

    if (!nameToSearch) {
      setError("Location name cannot be empty.");
      return;
    }

    setIsGeocoding(true);
    try {
      const response = await axios.get(NOMINATIM_URL, {
        params: { q: nameToSearch },
        headers: {
          'User-Agent': 'RoadTripPlanner/1.0 (YourAppContact@example.com)'
        }
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const newLocation = {
          name: nameToSearch,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        };
        setLocations([...locations, newLocation]);
        setCurrentLocationName('');
      } else {
        setError(`Could not find coordinates for: "${nameToSearch}". Try a more specific name.`);
      }
    } catch (err) {
      console.error('Geocoding Error:', err);
      setError("Geocoding service failed. Check internet connection or server status.");
    } finally {
      setIsGeocoding(false);
    }
  };

  /**
   * Removes a location from the list by its index.
   * @param {number} indexToRemove - The index of the location to remove.
   */
  const handleRemoveLocation = (indexToRemove) => {
    setLocations(locations.filter((_, index) => index !== indexToRemove));
    setError(null);
  };

  /**
   * Validates the form data and calls the onSubmit prop with the new trip data.
   * @param {React.FormEvent} e - The form submission event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || locations.length === 0) {
      setError("Please provide a title and at least one location stop.");
      return;
    }

    const newTrip = {
      title: title.trim(),
      description: description.trim(),
      locations: locations,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(newTrip);
      setTitle("");
      setDescription("");
      setLocations([]);
    } catch (err) {
      // Parent component is expected to handle and display submission errors.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Plus className="w-6 h-6 mr-2 text-indigo-600" />
        Create a New Road Trip
      </h2>

      {/* --- Error Display --- */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm" role="alert">
          {error}
        </div>
      )}

      {/* --- Title Input --- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trip Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g. Himalayan Adventure"
          required
        />
      </div>

      {/* --- Description Input --- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Add a brief description about this road trip..."
        />
      </div>

      {/* --- New Location Input (Geocoding) --- */}
      <div className="mb-6 border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Locations (Stops)
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentLocationName}
            onChange={(e) => setCurrentLocationName(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Type city/landmark name and press button"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleGeocodeAndAddLocation(e);
              }
            }}
          />
          <button
            type="button"
            onClick={handleGeocodeAndAddLocation}
            disabled={isGeocoding}
            className={`flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-300 ${isGeocoding ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
          >
            {isGeocoding ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            <span className="ml-1 hidden sm:inline">{isGeocoding ? 'Finding...' : 'Add Stop'}</span>
          </button>
        </div>
      </div>

      {/* --- Display Added Locations --- */}
      {locations.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-semibold text-gray-700 mb-2">Confirmed Stops ({locations.length})</h4>
          <ul className="space-y-2">
            {locations.map((loc, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-white border rounded-lg text-sm">
                <span className="flex items-center text-gray-800 font-medium truncate">
                  <MapPin className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  {loc.name}
                  <span className='ml-3 text-xs text-gray-400 hidden sm:inline'>({loc.latitude.toFixed(2)}, {loc.longitude.toFixed(2)})</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveLocation(index)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Action Buttons --- */}
      <div className="flex justify-end mt-6 space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || locations.length === 0}
          className={`px-5 py-2 text-white rounded-lg font-semibold transition ${isSubmitting || locations.length === 0
              ? "bg-indigo-300"
              : "bg-indigo-600 hover:bg-indigo-700"
            }`}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2 inline-block" />
          ) : (
            <Plus className="w-5 h-5 mr-1 inline-block" />
          )}
          Create Trip
        </button>
      </div>
    </form>
  );
};

export default TripForm;