import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data;
    },
  });

  const promoteMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return await axiosSecure.patch(`/users/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allUsers"]);
      Swal.fire("✅ Success!", "User promoted successfully.", "success");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allUsers"]);
      Swal.fire("🗑️ Deleted!", "User has been removed.", "info");
    },
  });

  const filtered = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aValue = sortField === "createdAt" ? new Date(a[sortField]) : a[sortField]?.toLowerCase();
    const bValue = sortField === "createdAt" ? new Date(b[sortField]) : b[sortField]?.toLowerCase();
    return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-8 my-11 text-4xl font-bold text-[var(--color-primary)]">
        All Registered Users
      </h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-4 input input-bordered"
      />

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow lg:overflow-x-hidden">
          <table className="table w-full">
            <thead className="bg-[var(--color-secondary)] text-white pb-5">
              <tr>
                <th>Photo</th>
                <th onClick={() => handleSort("name")} className="cursor-pointer">
                  Name {sortField === "name" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                </th>
                <th>Email</th>
                <th onClick={() => handleSort("createdAt")} className="cursor-pointer">
                  Joined {sortField === "createdAt" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                </th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.01, backgroundColor: "#fff7ed" }}
                  className="border-b"
                >
                  <td>
                    <img
                      src={user.image || "N/A"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt || user.joinedAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`px-3 py-2 text-xs font-semibold rounded-full shadow ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : user.role === "member"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="flex flex-wrap items-center gap-2">
                    {/* ✅ Make Admin - Only if user is already a member */}
                    {user.role === "member" && (
                      <button
                        onClick={() =>
                          Swal.fire({
                            title: "Promote to Admin?",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Yes",
                          }).then((res) => {
                            if (res.isConfirmed) {
                              promoteMutation.mutate({ id: user._id, role: "admin" });
                            }
                          })
                        }
                        className="p-4 text-white bg-[#EA580C] btn btn-xs hover:bg-orange-600"
                      >
                        Make Admin
                      </button>
                    )}

                    {/* ⚠️ Show alert if not member */}
                    {user.role !== "admin" && user.role !== "member" && (
                      <button
                        onClick={() =>
                          Swal.fire({
                            icon: "error",
                            title: "Not Allowed",
                            text: "Only members can be promoted to Admin!",
                          })
                        }
                        className="p-4 text-white bg-gray-400 cursor-not-allowed btn btn-xs"
                      >
                        Make Admin
                      </button>
                    )}

                    {/* ✅ Promote to Member */}
                    {user.role !== "member" && (
                      <button
                        onClick={() =>
                          Swal.fire({
                            title: "Promote to Member?",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Yes",
                          }).then((res) => {
                            if (res.isConfirmed) {
                              promoteMutation.mutate({ id: user._id, role: "member" });
                            }
                          })
                        }
                        className="p-4 text-white bg-[#FACC15] btn btn-xs hover:bg-yellow-600"
                      >
                        Make Member
                      </button>
                    )}

                    {/* ✅ Delete */}
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "Are you sure?",
                          text: "This action cannot be undone.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Delete",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteMutation.mutate(user._id);
                          }
                        })
                      }
                      className="p-4 text-white bg-red-500 btn btn-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && (
            <p className="mt-4 text-center text-gray-500">No users found.</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AllUsers;
