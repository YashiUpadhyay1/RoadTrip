import axios from "axios";

// Create an Axios instance with a base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/**
 * Interceptor to automatically attach the JWT token to every request.
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

// --- Trip API Calls ---

/**
 * Fetches all road trips from the backend (requires JWT).
 */
export const fetchTrips = async () => {
  const res = await API.get("/trips");
  return res.data;
};

/**
 * Creates a new road trip (requires JWT).
 */
export const createTrip = async (tripData) => {
  const res = await API.post("/trips", tripData);
  return res.data;
};

/**
 * Deletes a specific trip (requires JWT and ownership).
 */
export const deleteTrip = async (tripId) => {
  const res = await API.delete(`/trips/${tripId}`);
  return res.data;
};

// --- Auth API Calls ---

/**
 * Signs up a new user. Stores token and user info on success.
 */
export const signupUser = async (userData) => {
  const res = await API.post("/auth/signup", userData);
  localStorage.setItem("token", res.data.token);
  // Store user info (excluding token)
  return { _id: res.data._id, username: res.data.username, email: res.data.email };
};

/**
 * Logs in a user. Stores token and user info on success.
 */
export const loginUser = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  localStorage.setItem("token", res.data.token);
  // Store user info (excluding token)
  return { _id: res.data._id, username: res.data.username, email: res.data.email };
};
