import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaDirections,
  FaClock,
  FaEnvelope,
} from "react-icons/fa";

// Custom marker icon
const createCustomIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const LocationSection = () => {
  const [activeLocation, setActiveLocation] = useState(0);

  const locations = [
    {
      name: "Main Club",
      address: "123 Sports Arena, Gulshan, Dhaka",
      position: [23.7805733, 90.4192895],
      phone: "+880 1234 567890",
      hours: "Mon-Sun: 6AM - 10PM",
      email: "gulshan@sportsclub.com",
      color: "red",
    },
    {
      name: "Banani Branch",
      address: "456 Court Complex, Banani, Dhaka",
      position: [23.7934, 90.4064],
      phone: "+880 1234 567891",
      hours: "Mon-Sun: 7AM - 9PM",
      email: "banani@sportsclub.com",
      color: "blue",
    },
    {
      name: "Dhanmondi Center",
      address: "789 Athletic Center, Dhanmondi, Dhaka",
      position: [23.7465, 90.376],
      phone: "+880 1234 567892",
      hours: "Mon-Fri: 8AM - 8PM, Sat-Sun: 7AM - 9PM",
      email: "dhanmondi@sportsclub.com",
      color: "green",
    },
    {
      name: "Mirpur Facility",
      address: "321 Sports Hub, Mirpur, Dhaka",
      position: [23.8067, 90.3687],
      phone: "+880 1234 567893",
      hours: "Mon-Sun: 6AM - 9PM",
      email: "mirpur@sportsclub.com",
      color: "orange",
    },
    {
      name: "Uttara Complex",
      address: "654 Field House, Uttara, Dhaka",
      position: [23.8709, 90.3835],
      phone: "+880 1234 567894",
      hours: "Mon-Sun: 7AM - 10PM",
      email: "uttara@sportsclub.com",
      color: "violet",
    },
  ];

  useEffect(() => {
    // Fix for default marker icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <section className="px-4 py-16 mx-auto max-w-7xl ">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className=" lg:text-5xl text-4xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
            Our Locations
          </h2>
          <hr className="w-16 h-1 mx-auto mt-4 mb-6 bg-[var(--color-secondary)] rounded" />
          <p className="text-xl text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]">
            Find your nearest sports club facility
          </p>
        </motion.div>

        {/* Location Selector */}
        <div className="flex pb-2 mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex mx-auto space-x-4">
            {locations.map((location, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveLocation(index)}
                className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeLocation === index
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] text-[var(--color-text-primary)]"
                }`}
              >
                {location.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Contact Card + Map */}
        <div className="grid gap-8 mb-12 lg:grid-cols-2">
          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-xl bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white mb-6">
              {locations[activeLocation].name}
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-xl mt-1 text-[var(--color-primary)] dark:text-[var(--color-secondary)]" />
                <p className="text-[var(--color-text-primary)] dark:text-gray-300">
                  {locations[activeLocation].address}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <FaPhone className="text-xl text-[var(--color-primary)] dark:text-[var(--color-secondary)]" />
                <p className="text-[var(--color-text-primary)] dark:text-gray-300">
                  {locations[activeLocation].phone}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <FaEnvelope className="text-xl text-[var(--color-primary)] dark:text-[var(--color-secondary)]" />
                <p className="text-[var(--color-text-primary)] dark:text-gray-300">
                  {locations[activeLocation].email}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <FaClock className="text-xl text-[var(--color-primary)] dark:text-[var(--color-secondary)]" />
                <p className="text-[var(--color-text-primary)] dark:text-gray-300">
                  {locations[activeLocation].hours}
                </p>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${locations[
                activeLocation
              ].position.join(",")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3 mt-8 font-semibold transition-all rounded-lg btn-primary "
            >
              <FaDirections className="mr-2" />
              Get Directions
            </a>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-xl shadow-xl overflow-hidden border border-[var(--color-secondary)]"
            style={{ height: "100%", minHeight: "400px" }}
          >
            <MapContainer
              center={locations[activeLocation].position}
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
              {locations.map((location, index) => (
                <Marker
                  key={index}
                  position={location.position}
                  icon={createCustomIcon(location.color)}
                  eventHandlers={{
                    click: () => setActiveLocation(index),
                  }}
                >
                  <Popup>
                    <div className="font-medium">
                      <p className="text-[var(--color-primary)]">
                        {location.name}
                      </p>
                      <p className="text-sm">{location.address}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>
        </div>

        {/* All Locations */}
        <div className="pb-16 mt-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-3xl font-bold text-center text-[var(--color-primary)] md:text-4xl"
          >
            All Our Locations
          </motion.h3>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveLocation(index)}
                className={`relative overflow-hidden p-6 text-center rounded-xl cursor-pointer transition-all shadow-sm ${
                  activeLocation === index
                    ? "ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/5"
                    : "bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]"
                } border border-gray-100 dark:border-gray-700 hover:shadow-md`}
              >
                {/* Active location indicator */}
                {activeLocation === index && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-primary)]"></div>
                )}

                <div className="flex flex-col items-center">
                  {/* Icon with pulse animation when active */}
                  <motion.div
                    animate={{
                      scale: activeLocation === index ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`p-4 mb-4 rounded-full ${
                      activeLocation === index
                        ? "bg-[var(--color-primary)]/10 animate-pulse"
                        : "bg-[var(--color-primary)]/10 dark:bg-[var(--color-secondary)]/10"
                    }`}
                  >
                    <FaMapMarkerAlt
                      className={`text-2xl ${
                        activeLocation === index
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-primary)] dark:text-[var(--color-secondary)]"
                      }`}
                    />
                  </motion.div>

                  <h4 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)] dark:text-white">
                    {location.name}
                  </h4>

                  <p className="text-sm text-[var(--color-text-secondary)] dark:text-gray-400 mb-4">
                    {location.address}
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
