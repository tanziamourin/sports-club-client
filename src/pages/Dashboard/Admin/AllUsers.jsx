import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";
import { FiSearch, FiMail, FiUserCheck, FiTrash2, FiPhone } from "react-icons/fi";
import { motion } from "framer-motion";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => (await axiosSecure.get("/admin/users")).data,
  });

  const promoteMutation = useMutation({
    mutationFn: async ({ id, role }) => await axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(["allUsers"]);
      Swal.fire({
        toast: true,
        icon: "success",
        title: "Role updated!",
        timer: 1800,
        position: 'top-end',
        showConfirmButton: false,
        background: "var(--color-success)",
        color: "var(--color-surface)"
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["allUsers"]);
      Swal.fire({
        toast: true,
        icon: "info",
        title: "User deleted",
        timer: 1800,
        position: 'top-end',
        showConfirmButton: false,
        background: "var(--color-primary)",
        color: "var(--color-surface)"
      });
    },
  });

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return { background: "var(--color-primary)", color: "var(--color-surface)" };
      case "member":
        return { background: "var(--color-success)", color: "var(--color-surface)" };
      default:
        return { background: "var(--color-accent)", color: "#fff" };
    }
  };

  return (
    <div className="max-w-6xl px-4 mx-auto mt-10">
      <h2 className="mb-4 text-4xl font-bold lg:text-5xl" style={{ color: "var(--color-primary)" }}>
        User Management
      </h2>
      <p className="mb-8 text-sm text-[var(--color-text-secondary)]">
        Manage registered users and their permissions
      </p>

      {/* Search */}
      <div className="relative w-full max-w-sm mb-10">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-2 pl-10 pr-4 rounded-lg outline-none"
          style={{
            background: "var(--color-surface)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-secondary)"
          }}
        />
      </div>

      {/* Cards */}
      {isLoading ? (
        <p className="text-center text-[var(--color-text-primary)]">Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-[var(--color-text-secondary)]">No users found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map(u => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-[var(--color-surface)] rounded-2xl shadow hover:shadow-lg border-l-4 border-[var(--color-primary)] flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={u.image || "https://via.placeholder.com/40"}
                  alt={u.name}
                  className="object-cover w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)]">{u.name || "N/A"}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">{u.email}</p>
                </div>
              </div>

              {u.phone && (
                <div className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] mb-2">
                  <FiPhone /> {u.phone}
                </div>
              )}

              <div className="mb-4">
                <span className="px-2 py-1 text-xs font-semibold rounded-full" style={getRoleColor(u.role)}>
                  {u.role.toUpperCase()}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    promoteMutation.mutate({ id: u._id, role: u.role === "member" ? "admin" : "member" })
                  }
                  className="flex-1 px-3 py-2 rounded-lg text-white bg-[var(--color-success)] flex justify-center items-center gap-1"
                >
                  <FiUserCheck /> Promote
                </button>
                <button
                  onClick={() => deleteMutation.mutate(u._id)}
                  className="flex-1 px-3 py-2 rounded-lg text-white bg-[var(--color-primary)] flex justify-center items-center gap-1"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>

              <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
                Joined: {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUsers;
