import React, { useContext } from 'react';
import { AuthContext } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

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

  if (isLoading) return <p>Loading bookings...</p>;
   return (
    <div className='mt-20'>
      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-6">Pending Bookings</h2>
      {pendingBookings.length === 0 ? (
        <p>No pending bookings found.</p>
      ) : (
        <div className="grid gap-4">
          {pendingBookings.map((booking) => (
            <div key={booking._id} className="p-4 bg-white text-[var(--color-text-primarys)] rounded shadow">
              <p><strong>Court:</strong> {booking.courtType}</p>
              <p><strong>Slot:</strong> {booking.slot}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Price:</strong> ${booking.price}</p>
              <button
                className="px-4 py-1 mt-2 text-white bg-red-500 rounded"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberPendingBookings;