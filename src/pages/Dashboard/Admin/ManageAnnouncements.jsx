import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ManageAnnouncements = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", message: "" });

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => (await axiosSecure.get("/announcements")).data,
  });

  const createMutation = useMutation({
    mutationFn: async (newData) => await axiosSecure.post("/announcements", newData),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      Swal.fire({
        title: "🎉 Announcement Added!",
        text: "Your announcement has been posted.",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
      setFormData({ title: "", message: "" });
    },
    onError: () => Swal.fire("❌ Failed to add announcement", "", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/announcements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      Swal.fire("🗑️ Deleted!", "Announcement removed", "info");
    },
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      return Swal.fire("⚠️ Please fill in all fields", "", "warning");
    }
    createMutation.mutate(formData);
  };

  return (
    <motion.div
      className="p-6 bg-[var(--color-background)] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="mb-8 text-4xl font-bold lg:text-5xl text-[var(--color-primary)]">
        Manage Announcements
      </h2>

      {/* Add Announcement Form */}
      <motion.form
        onSubmit={handleAdd}
        className="max-w-3xl p-6 mx-auto mb-10 border border-[var(--color-secondary)] shadow-lg rounded-2xl bg-[var(--color-surface)]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="mb-6 text-xl font-semibold text-[var(--color-text-primary)]">
          Add New Announcement
        </h3>
        <div className="flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full input input-bordered"
          />
          <input
            type="text"
            placeholder="Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full input input-bordered"
          />
          <button
            type="submit"
            className="px-6 btn bg-[var(--color-primary)] text-white hover:bg-orange-700 transition-all"
          >
            Post
          </button>
        </div>
      </motion.form>

      {/* Card View */}
      <div className="space-y-6 lg:hidden">
        {isLoading ? (
          <p className="text-center text-[var(--color-text-secondary)]">Loading...</p>
        ) : announcements.length === 0 ? (
          <p className="text-center text-[var(--color-text-secondary)]">No announcements found.</p>
        ) : (
          announcements.map((a) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col overflow-hidden rounded-2xl shadow hover:shadow-lg transition bg-[var(--color-surface)] border border-[var(--color-secondary)]"
            >
              {/* Top Stripe */}
              <div className="w-full h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"></div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-[var(--color-primary)]">{a.title}</h3>
                <p className="mt-2 text-[var(--color-text-primary)]">{a.message}</p>
                <div className="flex gap-3 mt-4">
                  <button
                    className="btn btn-sm bg-[var(--color-secondary)] text-white hover:opacity-90"
                    onClick={() => navigate(`/dashboard/admin/announcements/edit/${a._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-white bg-red-500 btn btn-sm hover:bg-red-600"
                    onClick={() => {
                      Swal.fire({
                        title: "Delete?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                      }).then((result) => {
                        if (result.isConfirmed) deleteMutation.mutate(a._id);
                      });
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Table View */}
      <motion.div
        className="hidden overflow-x-auto border rounded-2xl lg:block"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <table className="min-w-full divide-y divide-[var(--color-secondary)]/20">
          <thead className="bg-[var(--color-secondary)]/10 text-[var(--color-text-secondary)]">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-left">Title</th>
              <th className="px-6 py-3 text-sm font-semibold text-left">Message</th>
              <th className="px-6 py-3 text-sm font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-secondary)]/10 text-[var(--color-text-primary)]">
            {isLoading ? (
              <tr>
                <td colSpan="3" className="py-6 text-center">Loading...</td>
              </tr>
            ) : announcements.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-6 text-center text-[var(--color-text-secondary)]">No announcements found.</td>
              </tr>
            ) : (
              announcements.map((a) => (
                <motion.tr
                  key={a._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-[var(--color-secondary)]/10 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{a.title}</td>
                  <td className="px-6 py-4">{a.message}</td>
                  <td className="flex gap-3 px-6 py-4">
                    <button
                      className="btn btn-sm bg-[var(--color-secondary)] text-white hover:opacity-90"
                      onClick={() => navigate(`/dashboard/admin/announcements/edit/${a._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-white bg-red-500 btn btn-sm hover:bg-red-600"
                      onClick={() => {
                        Swal.fire({
                          title: "Delete?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes",
                        }).then((result) => {
                          if (result.isConfirmed) deleteMutation.mutate(a._id);
                        });
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default ManageAnnouncements;
