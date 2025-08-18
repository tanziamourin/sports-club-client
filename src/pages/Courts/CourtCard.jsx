import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import BookingModal from "./BookingModal";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CourtCard = ({ court }) => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleBookClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0px 10px 20px rgba(0,0,0,0.08)" }}
      className="p-6 bg-[var(--color-surface)] rounded-2xl shadow border-l-4 border-[var(--color-primary)] transition"
    >
      <figure className="relative mb-4">
        <img
          src={court.image}
          alt={court.name}
          className="object-cover w-full h-48 rounded-xl"
        />
        <span
          className="absolute px-2 py-1 text-xs font-semibold rounded top-3 left-3"
          style={{
            background: "var(--color-primary)",
            color: "white",
          }}
        >
          {court.type}
        </span>
      </figure>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[var(--color-primary)]">
          {court.name}
        </h3>
        <p className="text-[var(--color-text-primary)]">
          Price: <span className="font-semibold">${court.price}</span>
        </p>
        <p
          className={`inline-block px-3 py-1 text-sm rounded-full font-semibold ${
            court.status === "Available"
              ? "bg-green-100 text-green-600"
              : court.status === "Unavailable"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {court.status}
        </p>

        <button
          onClick={handleBookClick}
          className="mt-3 px-4 py-2 text-white rounded-lg font-semibold hover:bg-[var(--color-secondary)] transition"
          style={{ background: "var(--color-primary)" }}
        >
          Book Now
        </button>
      </div>

      {/* Booking Modal */}
      <BookingModal
        court={court}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.div>
  );
};

export default CourtCard;
