'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { Button } from 'antd';
import L from 'leaflet';

// Define a custom red icon for the user's location
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to fly to searched location
function SearchedLocationController({ searchedLocation }) {
    const map = useMap();
    useEffect(() => {
        if (searchedLocation && map && typeof map.flyTo === 'function') {
            map.flyTo(searchedLocation, 14);
        }
    }, [searchedLocation, map]);

    return searchedLocation ? (
        <Marker position={searchedLocation}>
            <Popup>
                <strong>🎯 Searched Location</strong>
            </Popup>
        </Marker>
    ) : null;
}

// Custom component to handle geolocation and centering the map
function LocationMarker({ onLocationFound, hasSearched }) {
    const map = useMap();
    const [position, setPosition] = useState(null);

    useEffect(() => {
        let isMounted = true;
        if (!navigator.geolocation) return;

        // Force the browser to bypass IP caching and request high-accuracy GPS
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                if (!isMounted) return;
                const { latitude, longitude } = pos.coords;
                const latlng = { lat: latitude, lng: longitude };

                setPosition(latlng);

                if (!hasSearched && map && typeof map.flyTo === 'function') {
                    try {
                        map.flyTo(latlng, 14); // Zoom in on the user's location
                    } catch (e) {
                        console.warn("Map instance was not ready to flyTo:", e);
                    }
                }

                if (onLocationFound) onLocationFound(latlng);
            },
            (err) => {
                if (!isMounted) return;
                console.warn("High-accuracy geolocation failed or was denied:", err);
                // Fallback to leaflet's basic IP-based locate if native retrieval fails.
                if (map && typeof map.locate === 'function') {
                    map.locate().on("locationfound", function (e) {
                        if (!isMounted) return;
                        setPosition(e.latlng);
                        if (!hasSearched && map && typeof map.flyTo === 'function') {
                            try {
                                map.flyTo(e.latlng, 14);
                            } catch (err) {
                                console.warn("Map instance was not ready to flyTo:", err);
                            }
                        }
                        if (onLocationFound) onLocationFound(e.latlng);
                    });
                }
            }
            // Removed strict `{ enableHighAccuracy: true }` because it consistently times out on Windows Desktop
        );

        return () => {
            isMounted = false;
        };
    }, [map, onLocationFound, hasSearched]);

    return position === null ? null : (
        <Marker position={position} icon={redIcon}>
            <Popup>
                <strong>📍 You are here!</strong>
            </Popup>
        </Marker>
    );
}

export default function MapComponent({ spaces, onBookSpace, searchedLocation }) {
    // Default to the center of Sri Lanka if location services are disabled or not yet loaded
    const defaultCenter = [7.8731, 80.7718];
    const [userLocation, setUserLocation] = useState(null);

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <MapContainer
                center={defaultCenter}
                zoom={7}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Adds the Blue marker for the user's current location */}
                <LocationMarker onLocationFound={setUserLocation} hasSearched={!!searchedLocation} />

                {/* Controls the map view for manually searched locations */}
                <SearchedLocationController searchedLocation={searchedLocation} />

                {/* Render the parking spaces */}
                {spaces.map((space) => {
                    // Provide a deterministic, unshifting fallback coordinate if the database lacks exact lat/lng
                    // We use a simple hash of the ID to keep the fallback pin in the exact same spot forever
                    const hash = space._id ? space._id.toString().split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0;
                    const latOffset = ((hash % 100) / 1000) - 0.05;
                    const lngOffset = (((hash * 13) % 100) / 1000) - 0.05;

                    const lat = space.location.lat || defaultCenter[0] + latOffset;
                    const lng = space.location.lng || defaultCenter[1] + lngOffset;

                    return (
                        <Marker key={space._id} position={[lat, lng]}>
                            <Popup>
                                <div className="min-w-[150px]">
                                    <strong className="block text-base mb-1">{space.name}</strong>
                                    <div className="text-brand-600 font-semibold mb-1">${space.rates.hourly}/1st hr</div>

                                    {(space.rates.customTiers && space.rates.customTiers.length > 0) && (
                                        <div className="bg-gray-50 p-1.5 rounded border border-gray-100 text-xs mb-2 mt-1">
                                            <strong className="text-gray-500 block mb-0.5" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Conditions:</strong>
                                            {space.rates.customTiers.map((t, idx) => (
                                                <div key={idx} className="flex justify-between text-gray-600 leading-tight" style={{ gap: '8px' }}>
                                                    <span>{t.minHours} to {t.maxHours} hrs:</span>
                                                    <strong>${t.rate}/hr</strong>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <Button size="small" type="primary" block className="mt-2 search-btn-s" onClick={() => onBookSpace(space)}>Book</Button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
