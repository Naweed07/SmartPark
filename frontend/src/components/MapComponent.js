'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { Button } from 'antd';

// Custom component to handle geolocation and centering the map
function LocationMarker({ onLocationFound }) {
    const map = useMap();
    const [position, setPosition] = useState(null);

    useEffect(() => {
        // Request geolocation from the user's browser
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, 14); // Zoom in on the user's location
            if (onLocationFound) onLocationFound(e.latlng);
        });
    }, [map, onLocationFound]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>
                <strong>📍 You are here!</strong>
            </Popup>
        </Marker>
    );
}

export default function MapComponent({ spaces, onBookSpace }) {
    const defaultCenter = [40.7128, -74.0060]; // Fallback to New York if location is disabled
    const [userLocation, setUserLocation] = useState(null);

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <MapContainer
                center={defaultCenter}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Adds the Blue marker for the user's current location */}
                <LocationMarker onLocationFound={setUserLocation} />

                {/* Render the parking spaces */}
                {spaces.map((space) => {
                    // Mock coordinates: Spawn the parking spots dynamically around wherever the user is located
                    const baseLat = userLocation ? userLocation.lat : defaultCenter[0];
                    const baseLng = userLocation ? userLocation.lng : defaultCenter[1];

                    const lat = space.location.lat || baseLat + (Math.random() - 0.5) * 0.05;
                    const lng = space.location.lng || baseLng + (Math.random() - 0.5) * 0.05;

                    return (
                        <Marker key={space._id} position={[lat, lng]}>
                            <Popup>
                                <strong>{space.name}</strong><br />
                                ${space.rates.hourly}/hr<br />
                                <Button size="small" type="primary" onClick={() => onBookSpace(space)} className="mt-2">Book</Button>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
