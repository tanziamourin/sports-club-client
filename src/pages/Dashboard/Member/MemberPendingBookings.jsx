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

  // 🔍 Load pending bookings
  const { data: pendingBookings = [], isLoading } = useQuery({
    queryKey: ["memberPending", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/pending/${user.email}`);
      return res.data;
    },
  });

  // ❌ Cancel Booking Mutation
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
      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-8">Pending Bookings</h2>

      {pendingBookings.length === 0 ? (
        <p className="text-center text-[var(--color-text-secondary)]">No pending bookings found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingBookings.map((booking) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="p-5 transition-all border shadow-md rounded-xl"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-secondary)',
                color: 'var(--color-text-primary)'
              }}
            >
              <p><strong>Court:</strong> {booking.courtType}</p>
              <p><strong>Slot:</strong> {booking.slot}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Price:</strong> <span className="font-semibold">${booking.price}</span></p>

              <button
                className="w-full py-2 mt-4 font-semibold text-white transition-colors rounded-lg"
                style={{ background: 'var(--color-primary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-secondary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
                onClick={() =>
                  Swal.fire({
                    title: "Cancel Booking?",
                    text: "Are you sure you want to cancel this booking?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, cancel it!",
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
