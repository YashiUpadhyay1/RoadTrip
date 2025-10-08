import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// Import the Leaflet Routing Machine library
import 'leaflet-routing-machine';

// CRITICAL: We also need to import the CSS for the routing control
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; 

// 💥 FIX START: Replace require() with standard ES module imports for Vite 💥
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet marker icons (copy from your TripMap.jsx)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: shadow,
});
// 💥 FIX END 💥


// This component will manage the route drawing logic
function RoutingControl({ waypoints }) {
    const map = useMap(); // Get access to the Leaflet map instance

    useEffect(() => {
        if (!waypoints || waypoints.length < 2) {
            // Need at least two points to draw a route
            return;
        }

        // 1. Convert your trip locations into Leaflet Waypoint objects
        const leafletWaypoints = waypoints.map(loc => L.latLng(loc.latitude, loc.longitude));

        // 2. Create the Routing Control instance
        const routingControl = L.Routing.control({
            waypoints: leafletWaypoints,
            
            // Use the OSRM service (Open Source Routing Machine)
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
            }),

            // Appearance settings
            lineOptions: {
                styles: [{ color: '#1056ff', weight: 6, opacity: 0.8 }] // Blue line for the route
            },
            routeWhileDragging: false, 
            showAlternatives: false,
            // Hide the instructions panel (just show the map)
            collapsible: true, 
            altLineOptions: {
                styles: [{ color: '#88aaff', weight: 4, opacity: 0.4 }] // Style for alternative routes
            },
            fitSelectedRoutes: true, // Zoom the map to fit the whole route
        }).addTo(map);

        // Cleanup function: remove the control when the component unmounts
        return () => {
            map.removeControl(routingControl);
        };
    }, [map, waypoints]); // Re-run effect if waypoints change

    return null; // This component doesn't render anything itself, just controls the map
}


// The main component that wraps the map container
function RouteMap({ trip }) {
    
    // Safety check for empty or invalid data
    if (!trip || !trip.locations || trip.locations.length < 1) {
        return <div className="text-center p-8 text-gray-500">No route data available for this trip.</div>;
    }

    // Map needs a center point. Use the first stop.
    const firstLocation = trip.locations[0];
    const mapCenter = [firstLocation.latitude, firstLocation.longitude];

    return (
        <MapContainer 
            center={mapCenter} 
            zoom={6} 
            scrollWheelZoom={true}
            style={{ height: '70vh', width: '100%', borderRadius: '8px', zIndex: 1 }}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Conditional Rendering of Routing Control */}
            {trip.locations.length >= 2 ? (
                // Pass the locations array (which contains lat/lon objects)
                <RoutingControl waypoints={trip.locations} /> 
            ) : (
                // If there's only one location, just show a marker
                <Marker position={mapCenter}>
                    <Popup>{trip.title} Start Point</Popup>
                </Marker>
            )}

            {/* Render ALL markers for context, even if routing is visible */}
            {trip.locations.map((loc, index) => (
                <Marker 
                    key={index} 
                    position={[loc.latitude, loc.longitude]}
                >
                    <Popup>
                        **Stop {index + 1}: {loc.name}**
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    );
}

export default RouteMap;