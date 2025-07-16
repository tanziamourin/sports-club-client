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
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newData) => await axiosSecure.post("/announcements", newData),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      Swal.fire({
        title: "🎉 Announcement Added!",
        text: "Your announcement has been posted.",
        icon: "success",
        showClass: { popup: "animate__animated animate__fadeInDown" },
        hideClass: { popup: "animate__animated animate__fadeOutUp" },
        confirmButtonColor: "#EA580C",
      });
      setFormData({ title: "", message: "" });
    },
    onError: () => Swal.fire("❌ Failed to add announcement", "", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/announcements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      Swal.fire("🗑️ Deleted!", "", "info");
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
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-6 text-3xl font-bold text-center text-[var(--color-primary)]">
        Manage Announcements
      </h2>

      {/* ✅ Add Announcement Form */}
      <form
        onSubmit={handleAdd}
        className="max-w-2xl p-4 mx-auto mb-8 bg-white rounded-lg shadow-md"
      >
        <h3 className="mb-4 text-xl font-semibold text-[var(--color-text-primary)]">
          Add New Announcement
        </h3>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full mb-4 input input-bordered"
        />
        <input
          type="text"
          placeholder="Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full mb-4 input input-bordered"
        />
        <button
          type="submit"
          className="w-full btn bg-[var(--color-primary)] text-white"
        >
          Add Announcement
        </button>
      </form>

      {/* ✅ Card View on Small Screens */}
      <div className="space-y-4 lg:hidden">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : announcements.length === 0 ? (
          <p className="text-center text-gray-500">No announcements found.</p>
        ) : (
          announcements.map((a) => (
            <motion.div
              key={a._id}
              className="p-4 bg-white border border-gray-200 rounded shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold text-[var(--color-primary)]">{a.title}</h3>
              <p className="mt-1 text-gray-700">{a.message}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => navigate(`/dashboard/admin/announcements/edit/${a._id}`)}
                >
                  Edit
                </button>
                <button
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
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ✅ Table View on Large Screens */}
      <motion.div
        className="hidden overflow-x-auto bg-white rounded-lg shadow lg:block"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <table className="table w-full">
          <thead className="bg-[var(--color-secondary)] text-white text-md">
            <tr>
              <th>Title</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-[var(--color-text-primary)]">
            {isLoading ? (
              <tr><td colSpan="3" className="py-6 text-center">Loading...</td></tr>
            ) : announcements.length === 0 ? (
              <tr><td colSpan="3" className="py-6 text-center">No announcements found.</td></tr>
            ) : (
              announcements.map((a) => (
                <motion.tr
                  key={a._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-300 text-[var(--color-text-primarys)]"
                >
                  <td>{a.title}</td>
                  <td>{a.message}</td>
                  <td className="flex flex-wrap gap-2">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => navigate(`/dashboard/admin/announcements/edit/${a._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: "Delete?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes"
                        }).then(result => {
                          if (result.isConfirmed) deleteMutation.mutate(a._id);
                        });
                      }}
                      className="btn btn-sm btn-error"
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
