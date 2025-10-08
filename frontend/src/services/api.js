import axios from "axios";

// ✅ Dynamically set the backend URL:
// - During local development → uses localhost:5000
// - In production (Netlify) → uses VITE_API_BASE_URL from environment
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

/**
 * ✅ Automatically attach JWT token to every request.
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Trip API Calls ---

/** Fetch all road trips (requires JWT). */
export const fetchTrips = async () => {
  const res = await API.get("/trips");
  return res.data;
};

/** Create a new road trip (requires JWT). */
export const createTrip = async (tripData) => {
  const res = await API.post("/trips", tripData);
  return res.data;
};

/** Delete a trip (requires JWT & ownership). */
export const deleteTrip = async (tripId) => {
  const res = await API.delete(`/trips/${tripId}`);
  return res.data;
};

// --- Auth API Calls ---

/** Sign up a new user and store the token. */
export const signupUser = async (userData) => {
  const res = await API.post("/auth/signup", userData);
  localStorage.setItem("token", res.data.token);
  return {
    _id: res.data._id,
    username: res.data.username,
    email: res.data.email,
  };
};

/** Log in a user and store the token. */
export const loginUser = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  localStorage.setItem("token", res.data.token);
  return {
    _id: res.data._id,
    username: res.data.username,
    email: res.data.email,
  };
};
