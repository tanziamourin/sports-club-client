import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: stats = {} } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 "
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="p-10 mt-10 text-center bg-white rounded-lg shadow-md "
      >
        <img
          src={user?.photoURL}
          alt="Admin"
          className="w-24 h-24 mx-auto mb-3 rounded-full border-4 border-[var(--color-primary)]  "
        />
        <h2 className="text-xl font-semibold text-gray-500 ">{user?.displayName}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total Courts", value: stats.totalCourts, color: "bg-[var(--color-secondary)]" },
          { label: "Total Users", value: stats.totalUsers, color: "bg-[var(--color-accent)]" },
          { label: "Total Members", value: stats.totalMembers, color: "bg-[var(--color-primary)]" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            viewport={{ once: true }}
            className={`p-4 ${stat.color} text-[var(--color-text-primary)]  rounded shadow`}
          >
            <h4 className="text-lg font-semibold">{stat.label}</h4>
            <p className="text-2xl">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminProfile;
