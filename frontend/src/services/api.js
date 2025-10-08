/**
 * @fileoverview Centralized API service for interacting with the RoadTrip backend.
 * It uses Axios for HTTP requests and includes an interceptor to attach JWT tokens.
 * @module services/api
 */

import axios from "axios";

// Create an Axios instance with a base URL for all API requests
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/**
 * Axios request interceptor.
 * This function runs before each request is sent. It retrieves the JWT token
 * from localStorage and attaches it to the request's Authorization header.
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Type Definitions for API data ---

/**
 * Represents a single stop or location on a road trip.
 * @typedef {object} Location
 * @property {string} name - The user-provided name of the location.
 * @property {number} latitude - The geographic latitude.
 * @property {number} longitude - The geographic longitude.
 */

/**
 * Represents the data required to create a new trip.
 * @typedef {object} TripData
 * @property {string} title - The title of the trip.
 * @property {string} [description] - An optional description.
 * @property {Array<Location>} locations - An array of location objects.
 */

/**
 * Represents the full trip object returned from the API.
 * @typedef {object} Trip
 * @property {string} _id - The unique ID of the trip.
 * @property {string} title - The title of the trip.
 * @property {string} description - The trip's description.
 * @property {Array<Location>} locations - The trip's locations.
 * @property {string} createdBy - The ID of the user who created the trip.
 * @property {string} createdAt - The ISO timestamp of when the trip was created.
 */

/**
 * Represents the authenticated user object.
 * @typedef {object} User
 * @property {string} _id - The user's unique ID.
 * @property {string} username - The user's display name.
 * @property {string} email - The user's email address.
 */


// --- Trip API Calls ---

/**
 * Fetches all road trips for the authenticated user.
 * @returns {Promise<Array<Trip>>} A promise that resolves to an array of trip objects.
 */
export const fetchTrips = async () => {
  const res = await API.get("/trips");
  return res.data;
};

/**
 * Creates a new road trip.
 * @param {TripData} tripData - The data for the new trip.
 * @returns {Promise<Trip>} A promise that resolves to the newly created trip object.
 */
export const createTrip = async (tripData) => {
  const res = await API.post("/trips", tripData);
  return res.data;
};

/**
 * Deletes a specific trip by its ID.
 * @param {string} tripId - The ID of the trip to delete.
 * @returns {Promise<{message: string}>} A promise that resolves to a confirmation message.
 */
export const deleteTrip = async (tripId) => {
  const res = await API.delete(`/trips/${tripId}`);
  return res.data;
};


// --- Auth API Calls ---

/**
 * Signs up a new user. On success, it stores the JWT in localStorage.
 * @param {object} userData - The user's registration data.
 * @param {string} userData.username - The chosen username.
 * @param {string} userData.email - The user's email.
 * @param {string} userData.password - The user's password.
 * @returns {Promise<User>} A promise that resolves to the user object (without the token).
 */
export const signupUser = async (userData) => {
  const res = await API.post("/auth/signup", userData);
  localStorage.setItem("token", res.data.token);
  // Return only the user info, not the token, to be stored in the app state
  return { _id: res.data._id, username: res.data.username, email: res.data.email };
};

/**
 * Logs in an existing user. On success, it stores the JWT in localStorage.
 * @param {object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<User>} A promise that resolves to the user object (without the token).
 */
export const loginUser = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  localStorage.setItem("token", res.data.token);
  // Return only the user info, not the token, to be stored in the app state
  return { _id: res.data._id, username: res.data.username, email: res.data.email };
};