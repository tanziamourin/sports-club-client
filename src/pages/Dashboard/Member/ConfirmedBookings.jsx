import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ConfirmedBookings = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["confirmedBookings", user?.email],
    enabled: !!user?.email, // ensures query doesn't run unless user exists
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/confirmed/${user?.email}`);
      console.log("✅ Confirmed Bookings Response:", res.data); // for debugging
      return res.data;
    },
  });

  if (isLoading) return <p>Loading confirmed bookings...</p>;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Confirmed Bookings</h2>
      {bookings.length === 0 ? (
        <p>No confirmed bookings yet.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="p-4 bg-white rounded shadow">
              <p><strong>Court:</strong> {b.court || b.courtType || "N/A"}</p>
              <p><strong>Slot:</strong> {b.slots ? b.slots.join(", ") : b.slot || "N/A"}</p>
              <p><strong>Date:</strong> {b.date || "N/A"}</p>
              <p><strong>Price:</strong> ${b.price || "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfirmedBookings;
