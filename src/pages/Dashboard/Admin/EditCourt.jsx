import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

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
            {
              method: "POST",
              body: form,
            }
          );
          const imgData = await uploadRes.json();

          if (imgData.success) {
            imageURL = imgData.data.url;
          } else {
            return Swal.fire("❌ Image upload failed", "", "error");
          }
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
    <div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow">
      <h2 className="mb-6 text-2xl font-bold text-center text-orange-600">Edit Court</h2>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
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
          <button type="submit" className="btn btn-success">
            Update
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourt;
