import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";
import { 
  FiSearch, 
  FiMail, 
  FiUserCheck, 
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
  FiPlus,
  FiPhone
} from "react-icons/fi";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

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


  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = sortField === "createdAt" ? new Date(a[sortField]) : a[sortField]?.toLowerCase();
    const bVal = sortField === "createdAt" ? new Date(b[sortField]) : b[sortField]?.toLowerCase();
    return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // style object instead of string ⬇️
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
    <div className="p-4 md:p-6" style={{ background: "var(--color-background)" }}>
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>User Management</h2>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Manage registered users and their permissions
          </p>
        </div>

       
          <div className="relative w-64">
            <FiSearch className="absolute -translate-y-1/2 left-3 top-1/2" style={{ color: "var(--color-text-secondary)" }} />
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
      </div>

      {isLoading ? (
        <p style={{ color: "var(--color-text-primary)" }}>Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-secondary)" }}>
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ background: "var(--color-secondary)", color: "#fff" }}>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">
                    Name {sortField === "name" && (sortOrder === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
                  </div>
                </th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center gap-1">
                    Joined {sortField === "createdAt" && (sortOrder === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
                  </div>
                </th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid var(--color-background)" }}>
                  <td className="px-6 py-4">
                    <img src={u.image} alt="" className="object-cover rounded-full w-9 h-9" />
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--color-text-primary)" }}>
                    {u.name || "N/A"}
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--color-text-primary)" }}>
                    <div className="flex items-center gap-1"><FiMail />{u.email}</div>
                    {u.phone && <div className="flex items-center gap-1 text-xs"><FiPhone />{u.phone}</div>}
                  </td>
                  <td className="px-6 py-4 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full" style={getRoleColor(u.role)}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="flex justify-end gap-2 px-6 py-4 text-right">
                    <button
                      onClick={() => promoteMutation.mutate({ id: u._id, role: u.role === "member" ? "admin" : "member" })}
                      style={{ background: "var(--color-success)", color: "#fff" }}
                      className="p-2 rounded"
                    >
                      <FiUserCheck />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(u._id)}
                      style={{ background: "var(--color-primary)", color: "#fff" }}
                      className="p-2 rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-6 py-3 text-xs" style={{ color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-background)" }}>
            Showing {sorted.length} of {users.length} users
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
