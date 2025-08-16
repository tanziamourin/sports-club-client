import React from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    quote: "The coaching transformed my game completely!",
    author: "Sarah J.",
    role: "Competitive Player",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "Best facilities and friendliest community around.",
    author: "Mike T.",
    role: "Weekend Warrior",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    quote: "My kids love the youth programs!",
    author: "Priya K.",
    role: "Parent",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
];

const TestimonialsSection = () => {
  return (
    <section className="px-4 py-16 mx-auto max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary)] mb-4">
          Member Experiences
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]">
          Hear what our community says about their journey with us
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="p-8 rounded-xl bg-[var(--color-surface)] dark:bg-[var(--color-surface)] shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all"
          >
            <div className="flex mb-4 text-yellow-400">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
            
            <FaQuoteLeft className="mb-4 text-2xl text-[var(--color-primary)] dark:text-[var(--color-secondary)] opacity-20" />
            
            <p className="mb-6 text-lg italic text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)]">
              "{testimonial.quote}"
            </p>
            
            <div className="flex items-center gap-4">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.author}
                className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-primary)] dark:border-[var(--color-secondary)]"
              />
              <div>
                <p className="font-semibold text-[var(--color-text-primary)] dark:text-white">
                  {testimonial.author}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] dark:text-gray-400">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;