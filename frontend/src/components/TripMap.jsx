/**
 * @fileoverview A React component to display multiple trips and all their locations on a Leaflet map.
 * @module components/TripMap
 */

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons in Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: shadow,
});

const defaultCenter = [40.7128, -74.0060]; // Default to NYC

/**
 * Represents a single stop or location on a road trip.
 * @typedef {object} Location
 * @property {string} name - The user-provided name of the location.
 * @property {number} latitude - The geographic latitude of the location.
 * @property {number} longitude - The geographic longitude of the location.
 */

/**
 * Represents a complete trip object fetched from the API.
 * @typedef {object} Trip
 * @property {string} _id - The unique MongoDB ID of the trip.
 * @property {string} title - The title of the trip.
 * @property {Array<Location>} locations - An array of location objects for the trip route.
 */

/**
 * Renders a Leaflet map that displays markers for all locations from an array of trips.
 * If no trips are provided, it displays a default world map.
 *
 * @param {object} props - The component's props.
 * @param {Array<Trip>} props.trips - An array of trip objects to be displayed on the map.
 */
function TripMap({ trips }) {
    // Handle case where trips array is empty or contains no locations
    if (!trips || trips.length === 0 || trips.every(trip => !trip.locations || trip.locations.length === 0)) {
        return (
            <MapContainer
                center={defaultCenter}
                zoom={2}
                scrollWheelZoom={true}
                style={{ height: '50vh', width: '100%', borderRadius: '8px', border: '1px solid #ddd' }}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        );
    }

    // Flatten all locations from all trips into a single array
    const allLocations = trips.flatMap(trip => trip.locations || []).filter(loc => loc && loc.latitude && loc.longitude);

    // Determine map center based on the first available location
    const mapCenter = (allLocations.length > 0)
        ? [allLocations[0].latitude, allLocations[0].longitude]
        : defaultCenter;

    return (
        <MapContainer
            center={mapCenter}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: '60vh', width: '100%', borderRadius: '8px' }}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render markers for all locations across all trips */}
            {trips.flatMap(trip =>
                (trip.locations || []).map((loc, index) => (
                    <Marker
                        key={`${trip._id}-${index}`}
                        position={[loc.latitude, loc.longitude]}
                    >
                        <Popup>
                            <strong>Trip: {trip.title}</strong>
                            <br />
                            Stop: {loc.name || `Location ${index + 1}`}
                        </Popup>
                    </Marker>
                ))
            )}
        </MapContainer>
    );
}

export default TripMap;