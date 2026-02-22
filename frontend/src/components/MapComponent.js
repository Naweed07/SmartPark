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
        if (searchedLocation) {
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
        // Request geolocation from the user's browser
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            if (!hasSearched) {
                map.flyTo(e.latlng, 14); // Zoom in on the user's location only if no manual search
            }
            if (onLocationFound) onLocationFound(e.latlng);
        });
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
                <LocationMarker onLocationFound={setUserLocation} hasSearched={!!searchedLocation} />

                {/* Controls the map view for manually searched locations */}
                <SearchedLocationController searchedLocation={searchedLocation} />

                {/* Render the parking spaces */}
                {spaces.map((space) => {
                    // Mock coordinates: Spawn the parking spots dynamically around wherever the user is located OR searched
                    const baseLat = searchedLocation ? searchedLocation.lat : (userLocation ? userLocation.lat : defaultCenter[0]);
                    const baseLng = searchedLocation ? searchedLocation.lng : (userLocation ? userLocation.lng : defaultCenter[1]);

                    const lat = space.location.lat || baseLat + (Math.random() - 0.5) * 0.05;
                    const lng = space.location.lng || baseLng + (Math.random() - 0.5) * 0.05;

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

                                    <Button size="small" type="primary" block className="mt-2" onClick={() => onBookSpace(space)}>Book</Button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
