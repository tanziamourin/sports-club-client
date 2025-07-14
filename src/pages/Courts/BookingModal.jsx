import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const BookingModal = ({ court, isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSlotChange = (e) => {
    const value = e.target.value;
    setSlots((prev) =>
      prev.includes(value) ? prev.filter((slot) => slot !== value) : [...prev, value]
    );
  };

  const totalPrice = court.price * slots.length;

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to book a court.");
      navigate("/login");
      return;
    }

    if (!date || slots.length === 0) {
      toast.error("Please select a date and at least one slot");
      return;
    }

    const bookingData = {
      courtId: court._id,
      courtType: court.type,
      userEmail: user.email,
      userName: user.displayName,
      slot: slots,
      date,
      price: totalPrice,
      status: "pending",
    };

    try {
      const res = await axiosSecure.post("/bookings", bookingData);

      if (res.data?.alreadyExists) {
        toast.error("You already booked one of these slots.");
        return;
      }

      if (res.data?.insertedId) {
        setShowSuccess(true);
        setDate("");
        setSlots([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Booking failed. Try again.");
    }
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    onClose(); // close main modal too
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <div className="fixed inset-0 bg-black/40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
              <Dialog.Title className="mb-4 text-2xl font-bold text-gray-800">
                Book {court.type}
              </Dialog.Title>

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Date</label>
                  <input
                    type="date"
                    className="w-full input input-bordered"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Select Slots</label>
                  <div className="flex flex-col gap-2">
                    {court.slots.map((slot) => (
                      <label key={slot} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={slot}
                          checked={slots.includes(slot)}
                          onChange={handleSlotChange}
                          className="checkbox checkbox-sm"
                        />
                        {slot}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Price per slot: <strong>${court.price}</strong>
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    Selected slots: <strong>{slots.length}</strong>
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    Total Price: <strong>${totalPrice}</strong>
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={onClose} className="btn">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Booking
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Success Modal */}
      <Transition appear show={showSuccess} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeSuccessModal}>
          <div className="fixed inset-0 bg-black/40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <Dialog.Panel className="w-full max-w-sm p-6 text-center bg-white shadow-lg rounded-xl">
              <h2 className="mb-2 text-2xl font-bold text-green-600">Booking Successful!</h2>
              <p className="mb-4 text-gray-600">
                Your booking request has been sent for admin approval.
              </p>
              <button onClick={closeSuccessModal} className="w-full btn btn-success">
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default BookingModal;
