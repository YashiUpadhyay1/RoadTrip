import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 💥 FIX START: Replace require() with standard ES module imports for Vite 💥
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet marker icons not showing up in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina, // Use the imported variable
    iconUrl: icon,             // Use the imported variable
    shadowUrl: shadow,         // Use the imported variable
});
// 💥 FIX END 💥

const defaultCenter = [40.7128, -74.0060]; // Default to NYC (or any central point)

function TripMap({ trips }) {
    
    // 1. Handle case where trips array is empty or null
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
    
    // 2. Determine map center
    const mapCenter = (allLocations.length > 0)
        ? [allLocations[0].latitude, allLocations[0].longitude] 
        : defaultCenter;

    return (
        // Map container MUST have defined height
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

            {/* 3. Render markers for all locations */}
            {trips.flatMap(trip => 
                (trip.locations || []).map((loc, index) => (
                    <Marker 
                        // Use a unique key
                        key={`${trip._id}-${index}`} 
                        position={[loc.latitude, loc.longitude]}
                    >
                        <Popup>
                            **Trip: {trip.title}**
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