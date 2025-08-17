import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ApprovedBookings = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 🔍 Load Approved Bookings
  const { data: approved = [], isLoading } = useQuery({
    queryKey: ["approvedBookings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/approved/${user?.email}`);
      return res.data;
    },
  });

  // ❌ Cancel Booking
  const cancelMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/bookings/${id}`),
    onSuccess: () => {
      Swal.fire("Cancelled!", "Booking has been removed.", "success");
      queryClient.invalidateQueries(["approvedBookings"]);
    },
    onError: () => {
      Swal.fire("Error", "Could not cancel booking.", "error");
    },
  });

  if (isLoading) return <p className="mt-10 text-center">Loading approved bookings...</p>;

  return (
    <div className="max-w-5xl px-4 mx-auto mt-20">
      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-8">
        Approved Bookings
      </h2>

      {approved.length === 0 ? (
        <p className="text-center text-[var(--color-text-secondary)]">
          No approved bookings found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {approved.map((booking) => (
            <div
              key={booking._id}
              className="p-6 bg-[var(--color-surface)] rounded-2xl shadow hover:shadow-lg transition border border-transparent dark:border-gray-600"
            >
              <p className="mb-2 text-[var(--color-text-primary)]"><strong>Court:</strong> {booking.courtType}</p>
              <p className="mb-2 text-[var(--color-text-primary)]"><strong>Slot:</strong> {booking.slot}</p>
              <p className="mb-2 text-[var(--color-text-primary)]"><strong>Date:</strong> {booking.date}</p>
              <p className="mb-4 text-[var(--color-text-primary)]"><strong>Price:</strong> ${booking.price}</p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/dashboard/member/payment/${booking._id}`)}
                  className="px-4 py-2 text-white bg-[var(--color-success)] rounded-lg hover:bg-green-500 transition"
                >
                  Pay Now
                </button>

                <button
                  className="px-4 py-2 text-white bg-[var(--color-primary)] rounded-lg hover:bg-orange-500 transition"
                  onClick={() =>
                    Swal.fire({
                      title: "Cancel Booking?",
                      text: "Are you sure you want to cancel?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes, cancel it!",
                    }).then((res) => {
                      if (res.isConfirmed) {
                        cancelMutation.mutate(booking._id);
                      }
                    })
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedBookings;
