// ManageCourts.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ManageCourts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const imageHostKey = import.meta.env.VITE_image_upload_key;
  const navigate = useNavigate();

  const { data: courts = [], isLoading } = useQuery({
    queryKey: ["courts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/courts/all");
      return res.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newCourt) => await axiosSecure.post("/courts", newCourt),
    onSuccess: () => {
      queryClient.invalidateQueries(["courts"]);
      Swal.fire("✅ Court Added!", "", "success");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/courts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["courts"]);
      Swal.fire("Deleted!", "Court deleted.", "success");
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      await axiosSecure.patch(`/courts/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["courts"]);
      Swal.fire("✅ Status updated!", "", "success");
    },
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const type = form.type.value;
    const price = form.price.value;
    const imageFile = form.image.files[0];

    if (!name || !type || !price || !imageFile) {
      return Swal.fire("⚠️ Fill all fields!", "", "warning");
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${imageHostKey}`, {
      method: "POST",
      body: formData,
    });
    const imgData = await uploadRes.json();

    if (imgData.success) {
      const courtData = {
        name,
        type,
        price: parseFloat(price),
        image: imgData.data.url,
        status: "Available",
        slots: ["08:30 AM", "11:30 AM", "02:30 PM", "05:30 PM"],
      };
      addMutation.mutate(courtData);
      form.reset();
    } else {
      Swal.fire("❌ Image upload failed!", "", "error");
    }
  };

  const handleEditNavigate = (court) => {
    navigate(`/dashboard/admin/courts/edit/${court._id}`, { state: court });
  };

  return (
    <motion.div className="p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-orange-600 to-yellow-400 bg-clip-text">
        Manage Courts
      </h2>

      {/* Add Court Form */}
      <motion.form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 p-6 bg-white rounded-lg shadow md:grid-cols-2" whileHover={{ scale: 1.01 }}>
        <input name="name" type="text" placeholder="Court Name" className="input input-bordered" />
        <input name="type" type="text" placeholder="Type (e.g. Tennis)" className="input input-bordered" />
        <input name="image" type="file" accept="image/*" className="file-input file-input-bordered" />
        <input name="price" type="number" placeholder="Price" className="input input-bordered" />
        <button type="submit" className="col-span-full btn btn-accent">Add Court</button>
      </motion.form>

      {/* Court Table */}
      <div className="mt-8 overflow-x-auto bg-white rounded shadow">
        <table className="table">
          <thead className="bg-[var(--color-secondary)] text-white">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="text-center">Loading...</td></tr>
            ) : (
              courts.map((court) => (
                <motion.tr key={court._id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="hover:bg-orange-50">
                  <td><img src={court.image} alt="court" className="object-cover w-16 h-12 rounded" /></td>
                  <td>{court.name}</td>
                  <td>{court.type}</td>
                  <td>${court.price}</td>
                  <td>
                    <select
                      className="select select-bordered select-sm"
                      value={court.status}
                      onChange={(e) => statusMutation.mutate({ id: court._id, status: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                    </select>
                  </td>
                  <td className="flex flex-wrap gap-2">
                    <button className="btn btn-sm btn-info" onClick={() => handleEditNavigate(court)}>Edit</button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, delete it!",
                        }).then((result) => {
                          if (result.isConfirmed) deleteMutation.mutate(court._id);
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
      </div>
    </motion.div>
  );
};

export default ManageCourts;
