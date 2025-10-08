/**
 * @fileoverview The main dashboard page for authenticated users.
 * It fetches, displays, and manages the user's road trips, and includes a map overview.
 * @module pages/Home
 */

import React, { useEffect, useState, useCallback } from "react";
import { fetchTrips, createTrip, deleteTrip } from "../services/api";
import TripForm from "../components/TripForm";
import TripMap from "../components/TripMap";
import { MapPin, PlusCircle, Trash2, Globe, User } from "lucide-react";

const BACKGROUND_IMAGE_URL = 'https://clipart-library.com/2023/young-people-together-planning-trip-europe-top-view-empty-white-space-notebook-where-you-time-plan-text-travel-concept_292052-1627.jpg';

/**
 * @typedef {import('../components/Auth').User} User
 */

/**
 * @typedef {import('../components/TripMap').Trip} Trip
 */

/**
 * The Home page component. Serves as the main dashboard for an authenticated user.
 * It handles fetching, creating, and deleting trips. It also displays a welcome
 * screen for users who are not logged in.
 *
 * @param {object} props - The component's props.
 * @param {User | null} props.user - The authenticated user object, or null if the user is not logged in.
 */
const Home = ({ user }) => {
    const [trips, setTrips] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    const loadTrips = useCallback(async () => {
        setApiError(null);
        setIsLoading(true);
        try {
            const data = await fetchTrips();
            setTrips(data);
        } catch (err) {
            console.error("Error fetching trips:", err);
            setApiError(
                err.response?.data?.error ||
                "Failed to load trips. You might need to log in again."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            loadTrips();
        } else {
            setIsLoading(false);
            setTrips([]);
            setApiError("Please log in to view your planned road trips.");
        }
    }, [user, loadTrips]);

    const handleAddTrip = async (tripData) => {
        setApiError(null);
        try {
            await createTrip(tripData);
            setShowForm(false);
            loadTrips();
        } catch (err) {
            console.error("Error creating trip:", err);
            setApiError(err.response?.data?.error || "Failed to create trip.");
        }
    };

    const handleDeleteTrip = async (tripId) => {
        if (!window.confirm("Are you sure you want to delete this road trip?")) {
            return;
        }
        setApiError(null);
        try {
            await deleteTrip(tripId);
            loadTrips();
        } catch (err) {
            console.error("Error deleting trip:", err);
            setApiError(
                err.response?.data?.error || "Failed to delete trip. Check ownership."
            );
        }
    };

    // --- Content for unauthenticated users ---
    if (!user) {
        return (
            <div
                className="min-h-screen bg-gray-100 flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-48 py-8 text-center">
                    <div className="rounded-xl shadow-2xl p-10 bg-white/90">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Plan Your Next Adventure</h1>
                        <p className="text-xl text-indigo-600 mb-8">Secure your memories by logging in!</p>
                        <div className="p-10 bg-white rounded-xl shadow-xl">
                            <p className="text-lg text-gray-700">Please **log in or sign up** to create and view your personal road trips.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // --- Loading state ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-gray-600">Loading Trips...</span>
            </div>
        );
    }

    // --- Main content for authenticated users ---
    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-48 py-8 min-h-screen">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 flex items-center">
                    <Globe className="w-8 h-8 mr-3 text-indigo-600" /> My Road Trips
                </h1>
                {apiError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
                        <p>{apiError}</p>
                    </div>
                )}

                {/* Trip Form Toggle */}
                <button
                    className={`flex items-center px-6 py-3 mb-8 text-white font-semibold rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-[1.02] ${showForm ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? (<><Trash2 className="w-5 h-5 mr-2" /> Close Form</>) : (<><PlusCircle className="w-5 h-5 mr-2" /> Add New Trip</>)}
                </button>

                {showForm && (
                    <TripForm onSubmit={handleAddTrip} onCancel={() => setShowForm(false)} />
                )}

                {/* Map Integration */}
                <div className="bg-white/90 p-6 rounded-xl shadow-lg mb-10">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Trip Map Overview</h2>
                    <TripMap trips={trips} />
                </div>

                {/* Trip List */}
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">All My Adventures</h2>
                {trips.length === 0 ? (
                    <p className="text-gray-600 text-lg">No road trips have been planned yet. Click 'Add New Trip' to start your first journey!</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trips.map((trip) => (
                            <div key={trip._id} className="bg-white rounded-xl shadow-xl p-6 flex flex-col justify-between border-t-4 border-indigo-500 hover:shadow-2xl transition duration-300">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
                                    <p className="text-gray-600 mb-4 text-sm">{trip.description}</p>
                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                        <User className="w-4 h-4 mr-1" />
                                        <span className="font-medium text-indigo-600">{trip.createdBy?.username || "Unknown User"}</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 font-medium">
                                        <MapPin className="w-5 h-5 mr-2 text-red-500" /> Locations:
                                    </div>
                                    <ul className="list-disc list-inside mt-2 text-sm text-gray-600 ml-4">
                                        {trip.locations.map((loc, index) => (
                                            <li key={index} className="truncate">{loc.name}</li>
                                        ))}
                                    </ul>
                                </div>
                                {user && trip.createdBy?._id === user._id && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleDeleteTrip(trip._id)}
                                            className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition duration-150"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" /> Delete My Trip
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;