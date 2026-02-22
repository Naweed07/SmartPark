'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { Button, message } from 'antd';

// Component to handle map clicks, setting the pin, and auto-locating on mount
function LocationPickerHandler({ position, setPosition, initialPosition }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    useEffect(() => {
        // Only try to auto-locate if an initial position wasn't already provided (like from the auto-detect button)
        if (!initialPosition) {
            map.locate().on("locationfound", function (e) {
                map.flyTo(e.latlng, 15);
            });
        }
    }, [map, initialPosition]);

    return position === null ? null : (
        <Marker position={position} />
    );
}

export default function LocationPickerMap({ initialPosition, onConfirm }) {
    const defaultCenter = [40.7128, -74.0060]; // Fallback to New York
    const [position, setPosition] = useState(initialPosition || null);

    // If initial position updates (e.g. from Auto-Detect), update our local state
    useEffect(() => {
        if (initialPosition) {
            setPosition(initialPosition);
        }
    }, [initialPosition]);

    const handleConfirm = async () => {
        if (!position) {
            message.warning("Please click on the map to select a location first.");
            return;
        }

        try {
            message.loading({ content: 'Fetching address for pinned location...', key: 'reverseGeo' });
            // Reverse geocode the picked location
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
            const data = await res.json();

            if (data && data.display_name) {
                message.success({ content: 'Address resolved!', key: 'reverseGeo' });
                onConfirm({
                    address: data.display_name,
                    lat: position.lat,
                    lng: position.lng
                });
            } else {
                message.warning({ content: 'Coordinates saved, but address could not be resolved. Please type it manually.', key: 'reverseGeo' });
                onConfirm({
                    address: '',
                    lat: position.lat,
                    lng: position.lng
                });
            }
        } catch (error) {
            message.error({ content: 'Failed to fetch address details.', key: 'reverseGeo' });
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="w-full h-[300px] border border-gray-200 rounded-lg overflow-hidden relative z-0">
                <MapContainer
                    center={initialPosition || defaultCenter}
                    zoom={initialPosition ? 15 : 12}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPickerHandler position={position} setPosition={setPosition} initialPosition={initialPosition} />
                </MapContainer>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Click anywhere on the map to drop a pin.</span>
                <Button
                    type="primary"
                    onClick={handleConfirm}
                    disabled={!position}
                    className="bg-brand-500 hover:bg-brand-600"
                >
                    Confirm Pin Location
                </Button>
            </div>
        </div>
    );
}
