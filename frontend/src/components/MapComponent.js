'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { Button } from 'antd';

export default function MapComponent({ spaces, onBookSpace }) {
    const center = [40.7128, -74.0060]; // Default to New York

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {spaces.map((space) => {
                    // Mock coordinates around NY if none were provided by the owner
                    const lat = space.location.lat || center[0] + (Math.random() - 0.5) * 0.1;
                    const lng = space.location.lng || center[1] + (Math.random() - 0.5) * 0.1;

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
