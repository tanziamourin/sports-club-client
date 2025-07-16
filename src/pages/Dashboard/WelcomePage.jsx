import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

const WelcomePage = () => {
  const { role } = useContext(AuthContext);

  let welcomeMessage = "Welcome to User Dashboard";
  if (role === "admin") welcomeMessage = "Welcome to Admin Dashboard";
  else if (role === "member") welcomeMessage = "Welcome to Member Dashboard";

  return (
    <motion.div
      className="flex items-center justify-center h-[80vh] bg-[var(--color-background)] text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div>
        {/* Emoji bounce */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-4xl md:text-5xl"
        >
          🏸
        </motion.div>

        {/* Welcome message with typing effect */}
        <motion.h1
          className="mt-4 text-3xl md:text-5xl font-bold text-[var(--color-primary)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <span className="typing-animation">{welcomeMessage}</span>
        </motion.h1>
      </div>
    </motion.div>
  );
};

export default WelcomePage;
