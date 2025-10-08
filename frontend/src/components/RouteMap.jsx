/**
 * @fileoverview This file contains React components for displaying a road trip route on a Leaflet map.
 * It uses `react-leaflet` for the map and `leaflet-routing-machine` to draw the route.
 * @module components/RouteMap
 */

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Import the Leaflet Routing Machine library and its CSS
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Import and fix for default Leaflet marker icons in Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
});


/**
 * A "headless" React component that adds a routing control to a `react-leaflet` map.
 * It uses the Leaflet Routing Machine library to calculate and display a route
 * between the provided waypoints. This component does not render any visible JSX.
 *
 * @param {object} props - The component's props.
 * @param {Array<{latitude: number, longitude: number}>} props.waypoints - An array of location objects, each with latitude and longitude, to be used as stops in the route.
 */
function RoutingControl({ waypoints }) {
  const map = useMap(); // Get access to the Leaflet map instance

  useEffect(() => {
    if (!waypoints || waypoints.length < 2) {
      // Need at least two points to draw a route
      return;
    }

    // 1. Convert trip locations into Leaflet Waypoint objects
    const leafletWaypoints = waypoints.map((loc) => L.latLng(loc.latitude, loc.longitude));

    // 2. Create the Routing Control instance
    const routingControl = L.Routing.control({
      waypoints: leafletWaypoints,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
      lineOptions: {
        styles: [{ color: '#1056ff', weight: 6, opacity: 0.8 }],
      },
      routeWhileDragging: false,
      showAlternatives: false,
      collapsible: true,
      fitSelectedRoutes: true, // Zoom the map to fit the whole route
    }).addTo(map);

    // Cleanup function: remove the control when the component unmounts
    return () => {
      map.removeControl(routingControl);
    };
  }, [map, waypoints]); // Re-run effect if waypoints change

  return null; // This component doesn't render anything itself
}

/**
 * @typedef {object} Location
 * @property {string} name - The name of the location/stop.
 * @property {number} latitude - The latitude coordinate.
 * @property {number} longitude - The longitude coordinate.
 */

/**
 * @typedef {object} Trip
 * @property {string} title - The title of the trip.
 * @property {Array<Location>} locations - An array of location objects representing the stops.
 */

/**

 * Renders a Leaflet map displaying a road trip route.
 * It uses the `RoutingControl` component to draw the route if there are two or more stops,
 * and renders markers for each individual stop.
 *
 * @param {object} props - The component's props.
 * @param {Trip} props.trip - The trip object containing details and locations to be displayed.
 */
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

      {/* Conditionally render the routing line */}
      {trip.locations.length >= 2 ? (
        <RoutingControl waypoints={trip.locations} />
      ) : (
        // If there's only one location, just show its marker
        <Marker position={mapCenter}>
          <Popup>{trip.title} Start Point</Popup>
        </Marker>
      )}

      {/* Render ALL markers for context, even if routing is visible */}
      {trip.locations.map((loc, index) => (
        <Marker key={index} position={[loc.latitude, loc.longitude]}>
          <Popup>
            <strong>
              Stop {index + 1}: {loc.name}
            </strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default RouteMap;