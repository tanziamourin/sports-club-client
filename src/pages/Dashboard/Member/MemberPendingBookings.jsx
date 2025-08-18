import React, { useContext } from 'react';
import { AuthContext } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const MemberPendingBookings = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: pendingBookings = [], isLoading } = useQuery({
    queryKey: ["memberPending", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/pending/${user.email}`);
      return res.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/bookings/${id}`),
    onSuccess: () => {
      Swal.fire("Cancelled", "Your booking was cancelled.", "success");
      queryClient.invalidateQueries(["memberPending"]);
    },
    onError: () => {
      Swal.fire("Error", "Could not cancel booking.", "error");
    }
  });

  if (isLoading) return <p className="mt-8 text-center">Loading bookings...</p>;

  return (
    <div className="px-4 mt-20 md:px-0">
      <h2 className="mb-8 text-4xl font-bold text-center lg:text-5xl" style={{color:"var(--color-primary)"}}>
        Pending Bookings
      </h2>

      {pendingBookings.length === 0 ? (
        <p className="text-center text-[var(--color-text-secondary)]">No pending bookings found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols=3">
          {pendingBookings.map((booking) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: .3 }}
              className="p-6 bg-[var(--color-surface)] rounded-2xl shadow border-l-4 border-[var(--color-primary)] hover:shadow-lg transition"
            >
              <p className="mb-1 text-[var(--color-text-primary)]"><strong>Court:</strong> {booking.courtType}</p>
              <p className="mb-1 text-[var(--color-text-primary)]"><strong>Slot:</strong> {booking.slot}</p>
              <p className="mb-1 text-[var(--color-text-primary)]"><strong>Date:</strong> {booking.date}</p>
              <p className="mb-4 text-[var(--color-text-primary)]"><strong>Price:</strong> ${booking.price}</p>

              <button
                className="w-full py-2 font-semibold text-white transition-colors rounded-lg"
                style={{ background: 'var(--color-secondary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--color-secondary)'}
                onClick={() =>
                  Swal.fire({
                    title: "Cancel Booking?",
                    text: "Are you sure you want to cancel this booking?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, cancel it!"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      cancelMutation.mutate(booking._id);
                    }
                  })
                }
              >
                Cancel Booking
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberPendingBookings;
