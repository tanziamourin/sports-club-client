import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const slides = [
  {
    url: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=80",
    title: "🏟️ Welcome to Our Club",
    description: "Join a community where sports meets passion, and every member matters.",
    align: "left",
    button: { text: "Booking", link: "/courts", color: "btn-primary" }
  },
  {
    url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=80",
    title: "🎾 Premium Courts",
    description: "Enjoy world-class courts designed for every level of play and competition.",
    align: "left",
    button: { text: "Join Now", link: "/login", color: "btn-secondary px-5" }
  },
  {
    url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=80",
    title: "🔥 Exciting Activities",
    description: "From tournaments to training sessions, elevate your skills and have fun.",
    align: "left",
    button: { text: "Activities", link: "/membership", color: "btn-success" }
  },
];

const Banner = () => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const current = slides[index];

  return (
    <div className="w-full">
      <div
        className="relative overflow-hidden shadow-2xl rounded-2xl aspect-video md:aspect-[16/6]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image and overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={current.url}
              alt={current.title}
              className="object-cover w-full h-full"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Text content */}
        <div
          className={`absolute inset-0 z-10 flex items-center ${
            current.align === "left" ? "justify-start" : "justify-end"
          } px-6 md:px-16`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="max-w-md text-left"
            >
              <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl lg:text-6xl">
                {current.title}
              </h2>
              <p className="mb-6 text-lg text-orange-300 md:text-xl">
                {current.description}
              </p>

              {current.button && (
                <Link
                  to={current.button.link}
                  className={`px-6 py-3 font-semibold text-white rounded-lg shadow-lg transition-all duration-300 ${current.button.color}`}
                >
                  {current.button.text}
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="absolute z-30 flex gap-2 transform -translate-x-1/2 bottom-4 left-1/2">
          {slides.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === index ? "bg-orange-400 scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
