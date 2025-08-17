import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiSearch, 
  FiCalendar, 
  FiDollarSign, 
  FiUser, 
  FiMail, 
  FiMapPin, 
  FiClock,
  FiGrid,
  FiList
} from "react-icons/fi";

const ConfirmedBookingsAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["confirmed-bookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/bookings/confirmed");
      return res.data;
    },
  });

  const filtered = bookings.filter((b) =>
    b.courtType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-primary">
            Confirmed Bookings
          </h2>
          <p className="text-muted">
            View all successfully completed and paid bookings
          </p>
        </motion.div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search courts..."
              className="w-full py-2 pl-10 pr-4 transition border rounded-lg sm:w-64 border-muted/20 bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* View Toggle */}
          <div className="flex p-1 border rounded-lg bg-surface border-muted/20">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-md ${viewMode === "card" ? "bg-accent/10 text-accent" : "text-muted"}`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md ${viewMode === "table" ? "bg-accent/10 text-accent" : "text-muted"}`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center border bg-surface rounded-xl border-muted/20">
          <div className="flex justify-center mb-4 text-muted">
            <FiCalendar className="w-16 h-16" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-primary">
            No confirmed bookings
          </h3>
          <p className="text-muted">
            {search ? "No matching bookings found" : "No bookings have been confirmed yet"}
          </p>
        </div>
      ) : viewMode === "card" ? (
        // Card View
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <motion.div
              key={b._id}
              className="flex flex-col p-6 border shadow-sm bg-surface rounded-xl border-muted/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">
                  {b.courtType || b.court}
                </h3>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-success/10 text-success">
                  Confirmed
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <FiUser className="w-5 h-5 mr-3 text-muted" />
                  <span className="text-primary">{b.userName || b.name}</span>
                </div>
                <div className="flex items-center">
                  <FiMail className="w-5 h-5 mr-3 text-muted" />
                  <span className="text-primary">{b.userEmail || b.email}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="w-5 h-5 mr-3 text-muted" />
                  <span className="text-primary">{b.date}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="w-5 h-5 mr-3 text-muted" />
                  <span className="text-primary">
                    {Array.isArray(b.slots) ? b.slots.join(", ") : b.slot}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-muted/10">
                <div className="flex items-center">
                  <FiDollarSign className="w-5 h-5 mr-2 text-muted" />
                  <span className="text-xl font-bold text-primary">
                    ${b.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // Table View
        <div className="overflow-hidden border shadow-sm bg-surface rounded-xl border-muted/20">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-muted/10">
              <thead className="bg-muted/5">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-muted">
                    <div className="flex items-center">
                      <FiUser className="mr-2" /> User
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-muted">
                    <div className="flex items-center">
                      <FiMail className="mr-2" /> Email
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-muted">
                    <div className="flex items-center">
                      <FiMapPin className="mr-2" /> Court
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-muted">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" /> Date
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-muted">
                    <div className="flex items-center">
                      <FiClock className="mr-2" /> Slots
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-muted">
                    <div className="flex items-center">
                      <FiDollarSign className="mr-2" /> Price
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y bg-surface divide-muted/10">
                {filtered.map((b) => (
                  <motion.tr
                    key={b._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "var(--color-muted/5)" }}
                    className="transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary">
                        {b.userName || b.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary">
                        {b.userEmail || b.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary">
                        {b.courtType || b.court}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary">
                        {b.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary">
                        {Array.isArray(b.slots) ? b.slots.join(", ") : b.slot}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-primary">
                        ${b.price}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedBookingsAdmin;