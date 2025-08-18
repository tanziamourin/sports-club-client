import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const EditCourt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const imageHostKey = import.meta.env.VITE_image_upload_key;

  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    image: null,
  });

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const res = await axiosSecure.get(`/courts/${id}`);
        if (res.data) {
          setCourt(res.data);
          setFormData({
            name: res.data.name,
            type: res.data.type,
            price: res.data.price,
            image: null,
          });
        } else {
          Swal.fire("❌ Court not found", "", "error");
          navigate("/dashboard/admin/courts");
        }
      } catch (err) {
        Swal.fire("❌ Failed to load court", "", "error");
        navigate("/dashboard/admin/courts");
      } finally {
        setLoading(false);
      }
    };
    fetchCourt();
  }, [id, axiosSecure, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, type, price, image } = formData;

    if (!name || !type || !price) {
      return Swal.fire("⚠️ Please fill all fields", "", "warning");
    }

    Swal.fire({
      title: "Update court?",
      text: "Do you want to save changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let imageURL = court?.image;

        if (image) {
          const form = new FormData();
          form.append("image", image);

          const uploadRes = await fetch(
            `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
            { method: "POST", body: form }
          );
          const imgData = await uploadRes.json();
          if (imgData.success) imageURL = imgData.data.url;
          else return Swal.fire("❌ Image upload failed", "", "error");
        }

        const updatedCourt = {
          name,
          type,
          price: parseFloat(price),
          image: imageURL,
        };

        try {
          await axiosSecure.patch(`/courts/${id}`, updatedCourt);
          Swal.fire("✅ Updated successfully!", "", "success");
          navigate("/dashboard/admin/courts");
        } catch (err) {
          Swal.fire("❌ Update failed", "", "error");
        }
      }
    });
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (!court) return <div className="py-10 text-center text-red-500">Court not found</div>;

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-[var(--color-background)] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-[var(--color-surface)] rounded-2xl shadow-lg overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Gradient Stripe */}
        <div className="w-full h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"></div>

        <div className="grid gap-4 p-6 md:p-8 md:grid-cols-2">
          <h2 className="col-span-full mb-6 text-4xl font-bold text-[var(--color-primary)]">
            Edit Court
          </h2>

          <input
            type="text"
            placeholder="Court Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input input-bordered"
          />
          <input
            type="text"
            placeholder="Type (e.g. Tennis)"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="input input-bordered"
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="input input-bordered"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            className="file-input file-input-bordered"
          />

          <div className="text-center col-span-full">
            <p className="mb-1 text-sm text-gray-500">Current Image Preview:</p>
            {court?.image ? (
              <img
                src={court.image}
                alt="Court"
                className="object-cover w-48 h-32 mx-auto rounded"
              />
            ) : (
              <p className="text-gray-400">No image available</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4 col-span-full">
            <button
              type="submit"
              className="btn bg-[var(--color-primary)] text-white hover:opacity-90"
            >
              Update
            </button>
            <button
              type="button"
              className="btn btn-outline text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default EditCourt;
