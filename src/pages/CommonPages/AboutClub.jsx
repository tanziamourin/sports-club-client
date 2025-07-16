import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

// Local JSON animations (rename to remove spaces if needed)
import historyAnimation from "../../assets/History.json";
import missionAnimation from "../../assets/A crown.json";
import visionAnimation from "../../assets/Vision Eye.json";

const aboutData = [
  {
    title: "📜 Our History",
    text: "Founded in 1995, our club began as a small group of sports lovers. Today, we are a premier destination for athletes.",
    animation: historyAnimation,
  },
  {
    title: "🎯 Our Mission",
    text: "To foster a passionate and active community through professional facilities, inclusive programs, and events.",
    animation: missionAnimation,
  },
  {
    title: "🚀 Our Vision",
    text: "To redefine the local sports experience by building a legacy of excellence, inclusiveness, and innovation.",
    animation: visionAnimation,
  },
];

const AboutClub = () => {
  return (
    <section className="w-full h-auto overflow-y-hidden bg-[var(--color-background)] px-4 py-10 md:px-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-[var(--color-primary)] text-center mt-12">
          About the Club
        </h2>
        <hr className="w-16 h-1 mx-auto mt-3  mb-4 bg-[var(--color-accent)] rounded" />

        <div className="relative mt-10 border-l-4 border-[var(--color-primary)] space-y-20">
          {aboutData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="relative pl-10"
            >
              {/* Timeline Dot */}
              <span className="absolute left-[-11px] top-3 w-5 h-5 bg-[var(--color-accent)] border-4 border-white rounded-full z-10 animate-ping"></span>

              {/* Card */}
              <div className="flex flex-col items-center gap-6 p-6 transition duration-300 bg-white shadow-lg md:flex-row rounded-xl hover:shadow-xl">
                <div className="w-full md:w-1/2">
                  <Lottie
                    animationData={item.animation}
                    loop
                    autoplay
                    style={{ width: "75%", height: "auto" }}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-semibold text-[var(--color-text-primarys)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutClub;
