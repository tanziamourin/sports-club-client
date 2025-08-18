import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrophy,
  FaRunning,
  FaTableTennis,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const upcomingEvents = [
          {
            id: 1,
            title: "Summer Tennis Championship",
            date: "2025-08-25",
            time: "09:00 AM",
            location: "Main Club Court",
            description:
              "Annual summer tennis tournament with prizes for winners in all categories.",
            category: "tennis",
            registered: 24,
            capacity: 32,
            featured: true,
          },
          {
            id: 2,
            title: "Club Soccer Tournament",
            date: "2025-08-30",
            time: "02:00 PM",
            location: "Soccer Field",
            description:
              "Friendly 5v5 tournament open to all skill levels. Teams will be balanced.",
            category: "soccer",
            registered: 18,
            capacity: 40,
            featured: false,
          },
          {
            id: 3,
            title: "Advanced Training Camp",
            date: "2025-09-02",
            time: "06:00 PM",
            location: "Training Hall",
            description:
              "3-day intensive training session with professional coaches.",
            category: "training",
            registered: 12,
            capacity: 20,
            featured: true,
          },
          {
            id: 4,
            title: "Junior Badminton League",
            date: "2025-09-10",
            time: "04:00 PM",
            location: "Court 3",
            description:
              "For players under 18. Weekly matches with skill development sessions.",
            category: "badminton",
            registered: 8,
            capacity: 16,
            featured: false,
          },
          {
            id: 5,
            title: "Charity Fun Run",
            date: "2025-09-15",
            time: "08:00 AM",
            location: "Club Grounds",
            description:
              "5K run to support local youth sports programs. All members welcome!",
            category: "running",
            registered: 42,
            capacity: 100,
            featured: true,
          },
          {
            id: 6,
            title: "Table Tennis Open",
            date: "2025-09-20",
            time: "07:00 PM",
            location: "Recreation Room",
            description:
              "Weekly table tennis competition with rotating partners.",
            category: "table-tennis",
            registered: 6,
            capacity: 12,
            featured: false,
          },
        ];
        setEvents(upcomingEvents.slice(0, 3)); // Limit to top 3
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "tennis":
        return <FaTableTennis className="text-green-500" />;
      case "soccer":
        return <FaTrophy className="text-blue-500" />;
      case "running":
        return <FaRunning className="text-red-500" />;
      default:
        return <FaTrophy className="text-yellow-500" />;
    }
  };

  return (
    <div id="upcoming-events" className="px-4 py-12 mx-auto mt-10 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="mt-5 mb-5 text-4xl font-bold text-[var(--color-primary)] lg:text-5xl ">
          Upcoming Events & Tournaments
        </h2>
        <hr className="w-16 h-1 mx-auto mt-3 mb-4 bg-[var(--color-secondary)] rounded" />
        <p className="mt-5 text-lg text-[var(--color-text-primary)] ">
          Join our exciting events and showcase your skills
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 m-5lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-800 dark:border-gray-700 animate-pulse"
            >
              <div className="w-3/4 h-6 mb-4 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="w-1/2 h-4 mb-2 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="w-1/2 h-4 mb-4 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="h-3 mb-2 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="w-5/6 h-3 mb-2 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="w-2/3 h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
            </motion.div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 text-center bg-white rounded-2xl dark:bg-gray-800"
        >
          <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 text-[var(--color-primary)]  " />
          <p className="text-lg text-[var(--color-primary)] ">
            No upcoming events
          </p>
          <p className="mt-2 text-sm text-[var(--color-primary)]  ">
            Check back later
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {events.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`relative overflow-hidden rounded-xl bg-[var(--color-surface)] dark:bg-[var(--color-surface)] shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all group `}
                style={{ background: "var(--color-surface)" }}
              >
                {event.featured && (
                  <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-[var(--color-primary)]   rounded-bl-lg bg-primary-600 dark:bg-primary-500">
                    Featured
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 mt-1 rounded-full bg-primary-100 dark:bg-primary-900/50 text-[var(--color-primary)]  ">
                      {getCategoryIcon(event.category)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold  text-[var(--color-text-primary)]  ">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                          {event.time && ` • ${event.time}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt /> {event.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className=" text-[var(--color-text-primary)]  ">
                    {event.description}
                  </p>

                  <div className="w-full mt-4">
                    <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>Registered</span>
                      <span>
                        {event.registered}/{event.capacity}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-primary-600 dark:bg-primary-500"
                        style={{
                          width: `${
                            (event.registered / event.capacity) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
