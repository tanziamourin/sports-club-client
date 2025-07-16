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
    }
  });

  if (isLoading) return <p>Loading approved bookings...</p>;

  return (
    <div className="mt-20">
      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-6">Approved Bookings</h2>

      {approved.length === 0 ? (
        <p>No approved bookings found.</p>
      ) : (
        <div className="grid gap-4">
          {approved.map((booking) => (
            <div key={booking._id} className="p-4 bg-white  text-[var(--color-text-primarys)] rounded shadow">
              <p><strong>Court:</strong> {booking.courtType}</p>
              <p><strong>Slot:</strong> {booking.slot}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Price:</strong> ${booking.price}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/dashboard/member/payment/${booking._id}`)}
                  className="px-4 py-1 text-white bg-green-600 rounded"
                >
                  Pay Now
                </button>

                <button
                  className="px-4 py-1 text-white bg-red-500 rounded"
                  onClick={() =>
                    Swal.fire({
                      title: "Cancel Booking?",
                      text: "Are you sure?",
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
