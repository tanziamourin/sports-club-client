import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaDirections } from "react-icons/fa";

// Fix for default marker icons (Vite compatible)
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationSection = () => {
  const position = [23.7805733, 90.4192895];
  const locations = [
    "123 Sports Arena, Gulshan, Dhaka",
    "456 Court Complex, Banani, Dhaka",
    "789 Athletic Center, Dhanmondi, Dhaka",
    "321 Sports Hub, Mirpur, Dhaka",
    "654 Field House, Uttara, Dhaka"
  ];

  useEffect(() => {
    // Fix for marker icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
    });
  }, []);

  return (
    <section className="px-4 py-16 mx-auto max-w-7xl ">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary)] mb-2">
            📍 Our Locations
          </h2>
          <hr className="w-16 h-1 mx-auto mt-3 mb-4 bg-[var(--color-accent)] rounded" />
          <p className="text-lg text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]">
            Visit us at any of our 5 convenient locations
          </p>
        </motion.div>

        {/* Contact Info */}
        <div className="grid gap-6 mb-10 md:grid-cols-2 lg:grid-cols-3">
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-6 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-[var(--color-primary)]/10 dark:bg-[var(--color-secondary)]/10">
                <FaMapMarkerAlt className="text-xl text-[var(--color-primary)] dark:text-[var(--color-secondary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] dark:text-white">Main Club</h3>
            </div>
            <p className="text-[var(--color-text-secondary)] dark:text-gray-400 mb-2">
              123 Sports Arena, Gulshan, Dhaka
            </p>
            <p className="flex items-center gap-2 text-[var(--color-text-secondary)] dark:text-gray-400">
              <FaPhone className="text-[var(--color-primary)] dark:text-[var(--color-secondary)]" />
              +880 1234 567890
            </p>
          </motion.div>
        </div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-xl shadow-xl overflow-hidden border border-[var(--color-secondary)]"
          style={{ height: "450px" }}
        >
          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(map) => {
              setTimeout(() => {
                map.invalidateSize();
              }, 200);
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              noWrap={true}
            />
            <Marker position={position} icon={defaultIcon}>
              <Popup>
                <div className="font-medium">
                  <p className="text-[var(--color-primary)]">Main Sports Club</p>
                  <p>123 Sports Arena, Gulshan</p>
                  <a 
                    href="https://www.google.com/maps?q=23.7805733,90.4192895" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-1 text-sm text-[var(--color-accent)] hover:underline"
                  >
                    <FaDirections className="mr-1" /> Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          </MapContainer>

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=23.7805733,90.4192895"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 right-6 z-[1000] inline-flex items-center px-6 py-3 text-white transition-all rounded-lg shadow-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 dark:bg-[var(--color-secondary)] dark:hover:bg-[var(--color-secondary)]/90"
          >
            <FaDirections className="mr-2" />
            Get Directions
          </a>
        </motion.div>

        {/* All Locations List */}
        <div className="mt-10">
          <h3 className="mb-4 text-xl font-semibold text-center text-[var(--color-text-primary)] dark:text-white">
            All Club Locations
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                className="p-4 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 mt-1 rounded-full bg-[var(--color-primary)]/10 dark:bg-[var(--color-secondary)]/10">
                    <FaMapMarkerAlt className="text-[var(--color-primary)] dark:text-[var(--color-secondary)]" />
                  </div>
                  <p className="text-[var(--color-text-primary)] dark:text-gray-300">
                    {location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;