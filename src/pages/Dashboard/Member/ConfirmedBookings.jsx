import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { motion } from "framer-motion";

const ConfirmedBookings = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["confirmedBookings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/confirmed/${user?.email}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="mt-10 text-center">Loading confirmed bookings...</p>;

  return (
    <div className="max-w-5xl px-4 mx-auto mt-20">
      <h2 className="mb-8 text-4xl font-bold text-center lg:text-5xl" style={{ color: "var(--color-primary)" }}>
        Confirmed Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-[var(--color-text-secondary)]">No confirmed bookings yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <motion.div
              key={b._id}
              className="p-6 bg-[var(--color-surface)] rounded-2xl shadow border-l-4 border-[var(--color-primary)] hover:shadow-lg transition"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-1 text-[var(--color-text-primary)]"><strong>Court:</strong> {b.court || b.courtType || "N/A"}</p>
              <p className="mb-1 text-[var(--color-text-primary)]"><strong>Slot:</strong> {b.slots ? b.slots.join(", ") : b.slot || "N/A"}</p>
              <p className="mb-1 text-[var(--color-text-primary)]"><strong>Date:</strong> {b.date || "N/A"}</p>
              <p className="mb-3 text-[var(--color-text-primary)]"><strong>Price:</strong> ${b.price || "N/A"}</p>
              <span className="inline-block px-3 py-1 text-sm font-semibold text-white rounded-full bg-[var(--color-success)]">
                Confirmed
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfirmedBookings;
