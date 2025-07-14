import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LocationSection = () => {
  // Club এর GPS কোঅর্ডিনেট (Dhaka, Gulshan এর approx location)
  const position = [23.7805733, 90.4192895];

  return (
    <div className="px-4 my-10 text-center">
      <h2 className="mb-4 text-2xl font-bold">📍 Club Location</h2>
      <p className="mb-4 text-lg">123 Sports Arena, Gulshan, Dhaka, Bangladesh</p>

      <div className="mx-auto" style={{ height: '400px', maxWidth: '600px' }}>
        <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              123 Sports Arena, Gulshan, Dhaka, Bangladesh
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <a
        href="https://www.google.com/maps/place/Gulshan,+Dhaka"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 mt-4 text-white transition bg-blue-600 rounded hover:bg-blue-700"
      >
        View on Google Maps
      </a>
    </div>
  );
};

export default LocationSection;
