import React from "react";
import {
  FaUsers,
  FaTrophy,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
const StatsSection = () => {
  const stats = [
    {
      value: "250+",
      label: "Active Members",
      icon: <FaUsers className="text-5xl" />,
      color: "bg-orange-100 dark:bg-orange-900",
    },
    {
      value: "12",
      label: "Championships Won",
      icon: <FaTrophy className="text-5xl" />,
      color: "bg-blue-100 dark:bg-blue-900",
    },
    {
      value: "Daily",
      label: "Training Sessions",
      icon: <FaCalendarAlt className="text-5xl" />,
      color: "bg-green-100 dark:bg-green-900",
    },
    {
      value: "5",
      label: "Court Locations",
      icon: <FaMapMarkerAlt className="text-5xl" />,
      color: "bg-purple-100  dark:bg-purple-900",
    },
  ];

  return (
    <div className="px-5 mt-32 mb-20">
      <div className="grid grid-cols-1 gap-6 mx-auto sm:grid-cols-2 lg:grid-cols-4 max-w-7xl">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`p-6 text-center rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 ${stat.color} transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex justify-center text-[var(--color-primary)] mb-3">
              {stat.icon}
            </div>
            <h3 className="text-3xl font-bold text-[#1E293B] dark:text-[#6a7282] mb-1">
              {stat.value}
            </h3>
            <p className="text-[var(--color-text-secondary)] dark:text-gray-800 font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
