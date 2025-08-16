import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Professional Coaching",
    description: "Certified trainers for all skill levels",
    icon: "👨‍🏫",
    color: "bg-orange-100 dark:bg-orange-900/20"
  },
  {
    title: "Tournament Ready",
    description: "Regular competitive events",
    icon: "🏆",
    color: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    title: "Youth Programs",
    description: "Special training for young athletes",
    icon: "🧒",
    color: "bg-green-100 dark:bg-green-900/20"
  },
  {
    title: "Tournament Ready",
    description: "Regular competitive events",
    icon: "💳",
    color: "bg-purple-100 dark:bg-purple-900/20"
  },
];

const FeaturesSection = () => {
  return (
    <div className="px-4 py-16 mx-auto max-w-7xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary)] mb-4">
          Why Choose Our Club?
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]">
          Discover what makes us the premier choice for athletes of all levels
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex flex-col items-center gap-12 lg:flex-row">
        {/* Features List */}
        <div className="space-y-6 lg:w-1/2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`flex gap-5 p-6 rounded-xl ${feature.color} shadow-sm border border-gray-100 dark:border-gray-700 transition-all`}
            >
              <div className="flex items-center justify-center flex-shrink-0 text-3xl bg-white rounded-lg shadow-sm w-14 h-14 dark:bg-gray-800">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-6"
          >
            <button className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 dark:bg-[var(--color-secondary)] dark:hover:bg-[var(--color-secondary)]/90">
              Join Today →
            </button>
          </motion.div>
        </div>

        {/* Image */}
        <div className="lg:w-1/2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden shadow-xl rounded-2xl aspect-video"
          >
            <img
              src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
              alt="Club members playing"
              className="object-cover w-full h-full"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl font-bold">Community First</h3>
              <p className="mt-2 text-lg opacity-90">Where every member becomes family</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;