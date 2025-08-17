import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle,
  FiCalendar,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";

const TermsAndPolicies = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const policies = [
    {
      id: "rules",
      title: "Club Rules",
      icon: <FiAlertCircle className="w-5 h-5" />,
      items: [
        "All members must carry their membership card at all times.",
        "Respect other members and maintain a friendly environment.",
        "No food or drinks allowed on the courts.",
        "Proper sports attire and footwear must be worn during play.",
        "Follow the club schedule and timings strictly.",
      ],
    },
    {
      id: "booking",
      title: "Court Booking Policy",
      icon: <FiCalendar className="w-5 h-5" />,
      items: [
        "Courts can be booked up to 7 days in advance.",
        "Bookings are confirmed only after payment.",
        "Members may book a maximum of 2 hours per session.",
        "Any no-show without cancellation will forfeit the booking fee.",
      ],
    },
    {
      id: "cancellation",
      title: "Cancellation Policy",
      icon: <FiClock className="w-5 h-5" />,
      items: [
        "Cancellations must be made at least 24 hours before the session.",
        "Refunds will be processed according to the club's refund rules.",
        "Late cancellations may incur a penalty fee.",
        "Rescheduling is allowed once per booking, subject to availability.",
      ],
    },
    {
      id: "payment",
      title: "Payment Terms",
      icon: <FiDollarSign className="w-5 h-5" />,
      items: [
        "All payments must be made in full before using club facilities.",
        "Monthly memberships auto-renew unless canceled 7 days before renewal.",
        "A 2.5% processing fee applies to credit card payments.",
        "Unpaid balances after 30 days may result in membership suspension.",
      ],
    },
  ];

  return (
    <div className="container max-w-4xl px-4 py-12 mx-auto space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 text-center"
      >
        <h1
          className="mb-2 text-4xl font-bold lg:text-5xl md:text-4xl"
          style={{ color: "var(--color-primary)" }}
        >
          Terms & Club Policies
        </h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Please review our club policies and guidelines
        </p>
      </motion.div>

      {/* Policies */}
      <div className="space-y-5">
        {policies.map((policy, index) => (
          <motion.div
            key={policy.id}
            className="overflow-hidden transition-all duration-300 border shadow-md backdrop-blur-md rounded-2xl hover:shadow-lg"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-background)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(policy.id)}
              className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
              aria-expanded={openSection === policy.id}
              aria-controls={`${policy.id}-content`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: "var(--color-primary)",
                    color: "white",
                  }}
                >
                  {policy.icon}
                </div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {policy.title}
                </h2>
              </div>
              {openSection === policy.id ? (
                <FiChevronUp style={{ color: "var(--color-text-secondary)" }} />
              ) : (
                <FiChevronDown
                  style={{ color: "var(--color-text-secondary)" }}
                />
              )}
            </button>

            {/* Expandable Content */}
            <AnimatePresence>
              {openSection === policy.id && (
                <motion.div
                  id={`${policy.id}-content`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6"
                >
                  <ul className="pl-2 space-y-3">
                    {policy.items.map((item, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start space-x-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <span
                          className="mt-1 font-bold"
                          style={{ color: "var(--color-accent)" }}
                        >
                          •
                        </span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Help Box */}
      <motion.div
        className="p-6 mt-10 border rounded-2xl"
        style={{
          background: "var(--color-accent)",
          color: "white",
          borderColor: "var(--color-accent)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="mb-2 text-lg font-semibold">
          Need help understanding our policies?
        </h3>
        <p>
          Contact our support team at{" "}
          <span className="font-semibold">support@clubname.com</span> or call{" "}
          <span className="font-semibold">(123) 456-7890</span>
        </p>
      </motion.div>
    </div>
  );
};

export default TermsAndPolicies;
