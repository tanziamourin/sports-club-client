import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

const LocationSection = () => {
  const position = [23.7805733, 90.4192895];

  return (
    <section className="px-4 py-12 mx-auto max-w-7xl">
      {/* bg-[var(--color-background)]  */}
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-[var(--color-primary)] mb-2"
        >
          📍 Club Location
        </motion.h2>
        <hr className="w-16 h-1 mx-auto mt-3  mb-4 bg-[var(--color-accent)] rounded" />
        <p className="text-lg text-[var(--color-text-secondary)] mb-6">
          123 Sports Arena, Gulshan, Dhaka, Bangladesh
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-lg shadow-lg overflow-hidden border border-[var(--color-secondary)] mx-auto max-w-3xl"
          style={{ height: "400px" }}
        >
          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>📍 123 Sports Arena, Gulshan, Dhaka, Bangladesh</Popup>
            </Marker>
          </MapContainer>
        </motion.div>

        <a
          href="https://www.google.com/maps/place/Gulshan,+Dhaka"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 mt-6 font-semibold transition rounded-md btn-primary"
        >
          View on Google Maps
        </a>
      </div>
    </section>
  );
};

export default LocationSection;
