import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";

const ManageAnnouncements = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ title: "", message: "" });
  const [editId, setEditId] = useState(null);

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    }
  });

  const addMutation = useMutation({
    mutationFn: async (data) => await axiosSecure.post("/announcements", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      Swal.fire("✅ Added!", "", "success");
      setFormData({ title: "", message: "" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => await axiosSecure.patch(`/announcements/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      Swal.fire("✅ Updated!", "", "success");
      setFormData({ title: "", message: "" });
      setEditId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/announcements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      Swal.fire("🗑️ Deleted!", "", "info");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;
    if (editId) {
      updateMutation.mutate({ id: editId, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Manage Announcements</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 md:flex-row">
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
        <button type="submit" className="btn btn-primary">
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button onClick={() => {
            setFormData({ title: "", message: "" });
            setEditId(null);
          }} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </form>

      {/* List */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="3">Loading...</td></tr>
            ) : (
              announcements.map((a) => (
                <tr key={a._id}>
                  <td>{a.title}</td>
                  <td>{a.message}</td>
                  <td className="flex gap-2">
                    <button onClick={() => {
                      setFormData({ title: a.title, message: a.message });
                      setEditId(a._id);
                    }} className="btn btn-sm btn-info">Edit</button>
                    <button onClick={() => {
                      Swal.fire({
                        title: "Delete?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes"
                      }).then(result => {
                        if (result.isConfirmed) deleteMutation.mutate(a._id);
                      });
                    }} className="btn btn-sm btn-error">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAnnouncements;
