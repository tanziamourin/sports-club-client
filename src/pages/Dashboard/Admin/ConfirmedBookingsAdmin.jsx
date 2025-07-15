import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";

const ConfirmedBookingsAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["confirmed-bookings"],
    queryFn: async () => {
    const res = await axiosSecure.get("/admin/bookings/confirmed");
      return res.data;
    }
  });
const filtered = bookings.filter((b) =>
  b.courtType?.toLowerCase().includes(search.toLowerCase())
);


  return (
    <div className="p-4">
      <h2 className="mb-8 my-11 text-4xl font-bold text-[var(--color-primary)]">All Confirmed Bookings</h2>

      <input
        type="text"
        placeholder="Search by Court Type"
        className="w-full max-w-xs mb-4 input input-bordered"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No confirmed bookings found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow lg:overflow-x-hidden">
          <table className="table w-full">
            <thead className="bg-[var(--color-secondary)] text-white">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Court</th>
                <th>Date</th>
                <th>Slots</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id}>
              <td>{b.userName || b.name}</td>
<td>{b.userEmail || b.email}</td>
<td>{b.courtType || b.court}</td>
<td>{b.date}</td>
<td>{Array.isArray(b.slots) ? b.slots.join(", ") : b.slot}</td>
<td>${b.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConfirmedBookingsAdmin;
