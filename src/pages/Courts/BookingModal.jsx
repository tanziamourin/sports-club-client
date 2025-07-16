import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

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
    onClose();
  };

  return (
    <>
      {/* Booking Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <div className="fixed inset-0 bg-black/40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-[var(--color-background)] shadow-xl rounded-xl border border-orange-200">
              <Dialog.Title className="mb-4 text-2xl font-bold text-[var(--color-primary)]">
                Book {court.type}
              </Dialog.Title>

              <form onSubmit={handleBooking} className="space-y-4">
                {/* Date Input */}
                <div>
                  <label className="block mb-1 text-sm font-medium  text-[var(--color-primary)]">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full pr-10   text-[var(--color-primary)] input input-bordered"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                    {/* <span className="absolute text-lg text-gray-400 -translate-y-1/2 right-3 top-1/2">📅</span> */}
                  </div>
                </div>

                {/* Slot Selection */}
                <div>
                  <label className="block mb-1 text-sm font-medium  text-[var(--color-primary)]">Select Slots</label>
                  <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-40">
                    {court.slots.map((slot) => (
                      <label key={slot} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          value={slot}
                          checked={slots.includes(slot)}
                          onChange={handleSlotChange}
                          className="checkbox checkbox-primary"
                        />
                        <span>{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="space-y-1 text-sm  text-[var(--color-primary)]">
                  <p>💰 Price per slot: <strong>${court.price}</strong></p>
                  <p>🕒 Selected slots: <strong>{slots.length}</strong></p>
                  <p>Total Price: <strong className="text-[var(--color-primary)]">${totalPrice}</strong></p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={onClose} className="btn">
                    Cancel
                  </button>
                  <button type="submit" className="btn bg-[var(--color-primary)] text-white hover:bg-orange-700">
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
            <Dialog.Panel className="w-full max-w-sm p-6 text-center bg-white border border-green-200 shadow-lg rounded-xl animate__animated animate__fadeInDown">
              <CheckCircleIcon className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <h2 className="mb-2 text-xl font-bold text-green-600">Booking Successful!</h2>
              <p className="mb-4 text-gray-600">
                Your booking request has been sent for admin approval.
              </p>
              <button onClick={closeSuccessModal} className="w-full text-white bg-green-500 btn hover:bg-green-600">
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
