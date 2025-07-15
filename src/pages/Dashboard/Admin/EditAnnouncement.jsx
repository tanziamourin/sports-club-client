import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const EditAnnouncement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await axiosSecure.get(`/announcements/${id}`);
        setFormData({ title: res.data.title, message: res.data.message });
      } catch (err) {
        Swal.fire("❌ Failed to fetch announcement", "", "error");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id, axiosSecure]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      return Swal.fire("⚠️ Please fill all fields", "", "warning");
    }

    try {
      await axiosSecure.patch(`/announcements/${id}`, formData);
      Swal.fire("✅ Updated successfully!", "", "success");
      navigate("/dashboard/admin/announcements");
    } catch (err) {
      Swal.fire("❌ Update failed", "", "error");
      console.log(err);
    }
  };

  if (loading) return <p className="py-10 text-center">Loading...</p>;

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-[var(--color-background)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.form
        onSubmit={handleUpdate}
        className="w-full max-w-xl p-8 bg-white rounded-lg shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-primary)]">Edit Announcement</h2>

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
          className="w-full mb-6 input input-bordered"
        />

        <div className="flex justify-end gap-3">
          <button type="submit" className="btn bg-[var(--color-primary)] text-white">
            Update
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">
            Cancel
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default EditAnnouncement;
