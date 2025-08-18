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
  FiList,
} from "react-icons/fi";

const ConfirmedBookingsAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["confirmed-bookings"],
    queryFn: async () => (await axiosSecure.get("/admin/bookings/confirmed")).data,
  });

  const filtered = bookings.filter((b) =>
    b.courtType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 mx-auto space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-2 text-4xl font-bold lg:text-5xl" style={{color:"var(--color-primary)"}}>
            Confirmed Bookings
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            View all successfully completed and paid bookings
          </p>
        </motion.div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"/>
            <input
              type="text"
              placeholder="Search courts..."
              className="w-full py-2 pl-10 pr-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-secondary)", color: "var(--color-text-primary)" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* View Toggle */}
          <div className="flex p-1 border rounded-lg" style={{ background: "var(--color-surface)", borderColor: "var(--color-secondary)" }}>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-md ${viewMode === "card" ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"}`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md ${viewMode === "table" ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"}`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-[var(--color-primary)]"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center border rounded-2xl" style={{ background: "var(--color-surface)", borderColor: "var(--color-secondary)" }}>
          <div className="flex justify-center mb-4 text-[var(--color-text-secondary)]">
            <FiCalendar className="w-16 h-16" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-[var(--color-primary)]">No confirmed bookings</h3>
          <p className="text-[var(--color-text-secondary)]">
            {search ? "No matching bookings found" : "No bookings have been confirmed yet"}
          </p>
        </div>
      ) : viewMode === "card" ? (
        // Card View
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <motion.div
              key={b._id}
              className="flex flex-col p-6 border shadow-sm rounded-2xl hover:shadow-md"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-secondary)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                  {b.courtType || b.court}
                </h3>
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)]">
                  Confirmed
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiUser className="text-[var(--color-text-secondary)]" />
                  <span className="text-[var(--color-text-primary)]">{b.userName || b.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="text-[var(--color-text-secondary)]" />
                  <span className="text-[var(--color-text-primary)]">{b.userEmail || b.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-[var(--color-text-secondary)]" />
                  <span className="text-[var(--color-text-primary)]">{b.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-[var(--color-text-secondary)]" />
                  <span className="text-[var(--color-text-primary)]">{Array.isArray(b.slots) ? b.slots.join(", ") : b.slot}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t" style={{ borderColor: "var(--color-secondary)/30" }}>
                <div className="flex items-center gap-2 font-bold text-[var(--color-primary)]">
                  <FiDollarSign /> ${b.price}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // Table View
        <div className="overflow-hidden border rounded-2xl" style={{ background: "var(--color-surface)", borderColor: "var(--color-secondary)" }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-secondary)]/10">
              <thead className="bg-[var(--color-secondary)]/5 text-[var(--color-text-secondary)]">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-left uppercase">User</th>
                  <th className="px-6 py-3 text-xs font-semibold text-left uppercase">Email</th>
                  <th className="px-6 py-3 text-xs font-semibold text-left uppercase">Court</th>
                  <th className="px-6 py-3 text-xs font-semibold text-left uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-left uppercase">Slots</th>
                  <th className="px-6 py-3 text-xs font-semibold text-left uppercase">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-secondary)]/10">
                {filtered.map((b) => (
                  <motion.tr
                    key={b._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "var(--color-secondary)/10" }}
                    className="transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-[var(--color-text-primary)]">{b.userName || b.name}</td>
                    <td className="px-6 py-4 text-[var(--color-text-primary)]">{b.userEmail || b.email}</td>
                    <td className="px-6 py-4 text-[var(--color-text-primary)]">{b.courtType || b.court}</td>
                    <td className="px-6 py-4 text-[var(--color-text-primary)]">{b.date}</td>
                    <td className="px-6 py-4 text-[var(--color-text-primary)]">{Array.isArray(b.slots) ? b.slots.join(", ") : b.slot}</td>
                    <td className="px-6 py-4 font-semibold text-[var(--color-primary)]">${b.price}</td>
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
