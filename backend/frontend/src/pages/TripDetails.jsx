import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Loader2 } from 'lucide-react';

// Assuming you will create this component
import RouteMap from '../components/RouteMap'; 
// Assuming you have an API service function to fetch a single trip
// import { fetchTripDetails } from '../services/api'; 

// --- DUMMY fetchTripDetails for now ---
// Replace this with your actual API call:
const fetchTripDetails = async (id) => {
    // In a real app, this would call your backend:
    // const response = await fetch(`/api/trips/${id}`);
    // return response.json();

    // DUMMY DATA (Remove this block when connecting to your API)
    await new Promise(resolve => setTimeout(resolve, 500)); 
    if (id === 'trip-1') {
        return {
            _id: 'trip-1',
            title: 'Himalayan Adventure',
            description: 'A 7-day driving trip through the beautiful mountains.',
            locations: [
                { name: 'Shimla, HP', latitude: 31.1048, longitude: 77.1734 },
                { name: 'Manali, HP', latitude: 32.2432, longitude: 77.1892 },
                { name: 'Leh, Ladakh', latitude: 34.1526, longitude: 77.5770 }
            ],
            duration: '7 Days',
            distance: '1,200 km',
            createdBy: { username: 'Planner' },
            createdAt: new Date().toISOString(),
        };
    }
    throw new Error('Trip not found');
};
// ------------------------------------


const TripDetails = () => {
    // Get the trip ID from the URL (e.g., /trips/trip-1)
    const { id } = useParams(); 
    const [trip, setTrip] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTrip = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchTripDetails(id);
                setTrip(data);
            } catch (err) {
                console.error("Error fetching trip details:", err);
                setError("Failed to load trip details. It might have been deleted.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadTrip();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
                <span className="ml-3 text-lg text-gray-600">Loading Trip...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-48 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                    <p>{error}</p>
                    <Link to="/" className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium block">
                        Go back to Home
                    </Link>
                </div>
            </div>
        );
    }

    if (!trip) {
        return null; // Should be handled by error state, but a safeguard
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-48 py-8">
            <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6 transition">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to All Trips
            </Link>

            <div className="bg-white p-6 rounded-2xl shadow-2xl border-t-4 border-indigo-600 mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{trip.title}</h1>
                <p className="text-lg text-gray-600 mb-4">{trip.description}</p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mb-6">
                    <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-green-500" />
                        Planned: {new Date(trip.createdAt).toLocaleDateString()}
                    </span>
                    {/* Display route information if available from API/Routing Machine */}
                    {trip.duration && (
                        <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-yellow-600" />
                            Duration: {trip.duration}
                        </span>
                    )}
                    {trip.distance && (
                        <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-red-500" />
                            Distance: {trip.distance}
                        </span>
                    )}
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3 border-b pb-1">Route Overview</h2>
                    
                    {/* 💥 STEP 2 INTEGRATION: Display the Route Map */}
                    {/* Ensure your RouteMap component is in src/components/RouteMap.jsx */}
                    <RouteMap trip={trip} /> 
                    
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Stops List</h2>
                <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-700">
                    {trip.locations.map((loc, index) => (
                        <li key={index} className="flex items-center">
                            <span className="font-medium mr-2">{index + 1}.</span> {loc.name}
                            <span className="text-xs text-gray-400 ml-3">({loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)})</span>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default TripDetails;