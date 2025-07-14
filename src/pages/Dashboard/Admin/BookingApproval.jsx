import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../context/AuthContext"; // ✅ added

const BookingApproval = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { refetchRole } = useContext(AuthContext); // ✅ added

  // 🔹 Load all pending bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["pendingBookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings/pending");
      return res.data;
    },
  });

  // 🔹 Approve Booking
  const approveMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.patch(`/admin/bookings/approve/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingBookings"]);
      refetchRole(); // ✅ call refetchRole to update context
      Swal.fire("✅ Approved", "Booking approved successfully", "success");
    },
  });

  // 🔹 Reject Booking
  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/admin/bookings/reject/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingBookings"]);
      Swal.fire("❌ Rejected", "Booking has been rejected", "info");
    },
  });

  if (isLoading) return <p>Loading pending bookings...</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Pending Booking Requests</h2>
      {bookings.length === 0 ? (
        <p>No pending bookings.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Court</th>
                <th>Slot</th>
                <th>Date</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.email}</td>
                  <td>{b.courtType}</td>
                  <td>{b.slot}</td>
                  <td>{b.date}</td>
                  <td>${b.price}</td>
                  <td><span className="badge badge-warning">{b.status}</span></td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => approveMutation.mutate(b._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => rejectMutation.mutate(b._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingApproval;
