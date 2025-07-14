import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  {
    url: 'https://i.ibb.co/whqW0pdx/max-leveridge-ct-Me-Zl9-POx0-unsplash.jpg',
    label: '🏟️ Our Club',
  },
  {
    url: 'https://i.ibb.co/0yYwQdwj/kenneth-schipper-Hpbr-Uy3-Np-GE-unsplash.jpg',
    label: '🎾 Premium Courts',
  },
  {
    url: 'https://i.ibb.co/99c86FpB/pavitra-baxi-p1-B1-KIXpde-M-unsplash.jpg',
    label: '🔥 Exciting Activities',
  },
];

const Banner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
      <AnimatePresence>
        <motion.img
          key={images[index].url}
          src={images[index].url}
          alt={images[index].label}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 object-cover w-full h-full"
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Label Text */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <motion.h2
          key={images[index].label}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-extrabold text-center text-white md:text-5xl drop-shadow-lg animate-pulse"
        >
          {images[index].label}
        </motion.h2>
      </div>

      {/* Navigation Dots */}
      <div className="absolute z-30 flex gap-2 transform -translate-x-1/2 bottom-4 left-1/2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;