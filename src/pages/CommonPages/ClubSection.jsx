import { motion } from "framer-motion";
import StatsSection from "./StatsSection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";

const ClubSection = () => {
  return (
    <section className="">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mt-16 mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-[var(--color-primary)] lg:text-5xl"
          >
            Our Sports Club
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-3xl mx-auto mt-4 text-lg text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]"
          >
           Where passion meets performance, fitness becomes lifestyle, and every player belongs to something greater.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <StatsSection></StatsSection>

        {/* Features and Image */}
        <FeaturesSection></FeaturesSection>

        {/* Testimonials */}
        <TestimonialsSection></TestimonialsSection>
      </div>
    </section>
  );
};

export default ClubSection;
