import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    url: "https://i.ibb.co/whqW0pdx/max-leveridge-ct-Me-Zl9-POx0-unsplash.jpg",
    title: "🏟️ Welcome to Our Club",
    description:
      "Join a community where sports meets passion, and every member matters.",
    align: "left",
  },
  {
    url: "https://i.ibb.co/0yYwQdwj/kenneth-schipper-Hpbr-Uy3-Np-GE-unsplash.jpg",
    title: "🎾 Premium Courts",
    description:
      "Enjoy world-class courts designed for every level of play and competition.",
    align: "left",
  },
  {
    url: "https://i.ibb.co/99c86FpB/pavitra-baxi-p1-B1-KIXpde-M-unsplash.jpg",
    title: "🔥 Exciting Activities",
    description:
      "From tournaments to training sessions, elevate your skills and have fun.",
    align: "left",
  },
];

const Banner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = slides[index];

  return (
    <div className="relative w-full mt-10 h-[450px] md:h-[550px] overflow-hidden rounded-2xl shadow-2xl bg-gray-800">
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
            animate={{ opacity: 1, y: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="max-w-md text-left"
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
              {current.title}
            </h2>
            <p className="text-lg text-orange-300 md:text-xl">
              {current.description}
            </p>
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
              i === index ? "bg-orange-400 scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
