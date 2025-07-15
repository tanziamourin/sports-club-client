import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../context/AuthContext";
import { motion } from "framer-motion"; // ✅ animation

const BookingApproval = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { refetchRole } = useContext(AuthContext);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["pendingBookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings/pending");
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.patch(`/admin/bookings/approve/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingBookings"]);
      refetchRole();
      Swal.fire("✅ Approved", "Booking approved successfully", "success");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/admin/bookings/reject/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingBookings"]);
      Swal.fire("❌ Rejected", "Booking has been rejected", "info");
    },
  });

  if (isLoading) return <p>Loading pending bookings...</p>;

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="mb-8 my-11 text-4xl font-bold text-[var(--color-primary)]">Pending Booking Requests</h2>
      {bookings.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No pending bookings.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow lg:overflow-x-hidden">
          <table className="table w-full">
            <thead className="bg-[var(--color-secondary)] text-white">
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
              {bookings.map((b, index) => (
                <motion.tr
                  key={b._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                    whileHover={{
                    scale: 1.015,
                    backgroundColor: "#f3f4f6",
                  }}
                  className="transition-all duration-200"
                >
                  <td>{b.
userEmail}</td>
                  <td>{b.courtType}</td>
                  <td>{b.slot}</td>
                  <td>{b.date}</td>
                  <td>${b.price}</td>
                  <td>
                    <span className="text-black bg-yellow-400 badge">{b.status}</span>
                  </td>
                  <td className="flex gap-2">
                    <button
                      className="text-white bg-green-600 btn btn-sm hover:bg-green-700"
                      onClick={() => approveMutation.mutate(b._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="text-white bg-red-600 btn btn-sm hover:bg-red-700"
                      onClick={() => rejectMutation.mutate(b._id)}
                    >
                      Reject
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default BookingApproval;
