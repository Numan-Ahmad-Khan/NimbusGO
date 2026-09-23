import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationMarker({ onLocationSelect }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(event) {
            const { lat, lng } = event.latlng;

            const location = {
                latitude: lat,
                longitude: lng,
            };

            setPosition(event.latlng);
            onLocationSelect(location);
        },
    });

    return position ? <Marker position={position} /> : null;
}

export default function LocationPicker({ onLocationSelect }) {
    const defaultPosition = [34.0837, 74.7973];

    return (
        <div className="overflow-hidden rounded-2xl border border-neutral-200">
            <MapContainer
                center={defaultPosition}
                zoom={13}
                scrollWheelZoom={true}
                className="h-[400px] w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationMarker
                    onLocationSelect={onLocationSelect}
                />
            </MapContainer>
        </div>
    );
}