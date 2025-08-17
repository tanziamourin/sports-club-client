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
      whileHover={{ scale: 1.03 }}
      className="overflow-hidden transition-all duration-300 border shadow-lg rounded-xl"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-secondary)",
        color: "var(--color-text-primary)"
      }}
    >
      <figure className="relative">
        <img
          src={court.image}
          alt={court.name}
          className="object-cover w-full h-48"
        />
        <div
          className="absolute px-2 py-1 text-xs font-semibold rounded top-2 left-2"
          style={{
            background: "var(--color-primary)",
            color: "white"
          }}
        >
          {court.type}
        </div>
      </figure>

      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-lg font-bold">{court.name}</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Price: <span className="font-semibold">${court.price}</span>
        </p>

        <button
          onClick={handleBookClick}
          className="px-4 py-2 mt-2 font-semibold text-white transition-colors duration-300 rounded-lg"
          style={{
            background: "var(--color-primary)"
          }}
          onMouseEnter={e =>
            (e.currentTarget.style.background = "var(--color-secondary)")
          }
          onMouseLeave={e =>
            (e.currentTarget.style.background = "var(--color-primary)")
          }
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
