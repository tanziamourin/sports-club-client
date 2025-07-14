import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import { useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const PendingBookings = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  // const { user } = useContext(AuthContext);

  // const { data: bookings = [], isLoading } = useQuery({
  //   queryKey: ["pendingBookings", user?.email],
  //   queryFn: async () => {
  //     const res = await axiosSecure.get(`/bookings/pending/${user?.email}`);
  //     return res.data;
  //   },
  // });
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
    },
  });

  if (isLoading) return <p>Loading bookings...</p>;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Pending Bookings</h2>
      <div className="grid gap-4">
      {bookings.length === 0 ? <p>No pending bookings available</p> : 
  bookings.map((booking) => (
    <div key={booking._id} className="p-4 bg-white border rounded shadow">
      <p><strong>Court:</strong> {booking.courtType}</p>
      <p><strong>Slot:</strong> {booking.slot}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Price:</strong> ${booking.price}</p>
      <button
        onClick={() => cancelMutation.mutate(booking._id)}
        className="mt-2 text-white bg-red-500 btn"
      >
        Cancel
      </button>
    </div>
  ))
}
      </div>
    </div>
  );
};

export default PendingBookings;
