import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const PendingBookings = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["pendingBookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings/pending");
      return res.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/bookings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingBookings"]);
      Swal.fire("✅ Booking Canceled", "", "info");
    },
  });

  if (isLoading) return <p className="py-10 text-center">Loading bookings...</p>;

  return (
    <motion.div
      className="p-6 mt-20 bg-[var(--color-background)] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      
    >
      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-6">
        Pending Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">You have no pending bookings.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <motion.div
              key={booking._id}
              className="p-5 bg-white border border-orange-100 rounded-lg shadow"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-primarys)]">
                {booking.courtType}
              </h3>
              <p className="text-[var(--color-text-primarys)]"><strong>📅 Date:</strong> {booking.date}</p>
              <p className="text-[var(--color-text-primarys)]"><strong>🕒 Slots:</strong> {booking.slot.join(", ")}</p>
              <p className="text-[var(--color-text-primarys)]"><strong>💰 Price:</strong> ${booking.price}</p>
              <p>
                <strong className="text-[var(--color-text-primarys)]">Status:</strong>{" "}
                <span className="inline-block px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                  Pending
                </span>
              </p>

              <button
                onClick={() =>
                  Swal.fire({
                    title: "Cancel this booking?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, Cancel",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      cancelMutation.mutate(booking._id);
                    }
                  })
                }
                className="mt-4 text-white bg-red-500 btn btn-sm hover:bg-red-600"
              >
                Cancel
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PendingBookings;
