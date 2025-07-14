import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import BookingModal from "./BookingModal";
import { useNavigate } from "react-router-dom";

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
    <div className="shadow-md card bg-base-100">
      <figure>
        <img src={court.image} alt={court.name} className="object-cover w-full h-40" />
      </figure>
      <div className="card-body">
        <h2 className="text-lg font-semibold">{court.name}</h2>
        <p>Type: {court.type}</p>
        <p>Price: ${court.price}</p>
        <button onClick={handleBookClick} className="mt-2 btn btn-primary btn-sm">Book Now</button>
      </div>

      {/* Booking Modal */}
      <BookingModal
        court={court}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CourtCard;
