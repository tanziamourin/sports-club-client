import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useState } from "react";
import { motion } from "framer-motion";

// Reusable avatar component
const Avatar = ({ src, alt, className = "" }) => (
  <img
    src={src || "https://i.ibb.co/zfvpZf8/default-user.png"}
    alt={alt || "Profile"}
    className={className}
  />
);

// Framer motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const ManageMembers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/members");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/admin/members/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["members"]);
      Swal.fire("Deleted!", "Member has been removed.", "success");
    },
  });

  const filtered = members.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];

    if (sortField === "createdAt") {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    } else {
      valueA = valueA?.toLowerCase?.() || "";
      valueB = valueB?.toLowerCase?.() || "";
    }

    return sortOrder === "asc"
      ? valueA > valueB
        ? 1
        : -1
      : valueA < valueB
      ? 1
      : -1;
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
      <h2 className="mb-8 text-4xl font-bold my-11">All Club Members</h2>

      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 input input-bordered md:w-1/3"
      />

      {isLoading ? (
        <p>Loading members...</p>
      ) : (
        <div className="overflow-x-auto overflow-y-hidden bg-white rounded shadow lg:overflow-x-hidden">
          <table className="table w-full">
            <thead className="bg-[var(--color-secondary)] text-white">
              <tr>
                <th>Photo</th>
                <th onClick={() => handleSort("name")} className="cursor-pointer">
                  Name {sortField === "name" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                </th>
                <th>Email</th>
                <th onClick={() => handleSort("createdAt")} className="cursor-pointer">
                  Joined {sortField === "createdAt" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                </th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="show"
               className="hover:bg-[var(--color-background)]"
            >
              {sorted.map((m) => (
                <motion.tr
                  key={m._id}
                  variants={rowVariants}
                  whileHover={{
                    scale: 1.015,
                    backgroundColor: "#f3f4f6",
                  }}
                  className="transition-all duration-200"
                >
                  <td>
                    <Avatar
                      src={m.image}
                      alt={m.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`capitalize badge ${
                        m.status === "suspended"
                          ? "badge-error"
                          : m.status === "pending"
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                    >
                      {m.status || "active"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "Are you sure?",
                          text: "You won’t be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, delete!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteMutation.mutate(m._id);
                          }
                        })
                      }
                      className="transition-transform duration-200 btn btn-sm btn-error hover:scale-105"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>

          {sorted.length === 0 && (
            <p className="mt-4 text-center text-gray-500">No members found.</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ManageMembers;
