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

    const uploadRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
      { method: "POST", body: formData }
    );
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
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="mb-8 text-3xl font-extrabold text-center text-transparent bg-gradient-to-r from-orange-600 to-yellow-400 bg-clip-text">
        Manage Courts
      </h2>

      {/* Add Court Form */}
      <motion.form
        onSubmit={handleAdd}
        className="grid grid-cols-1 gap-4 p-6 shadow-md rounded-2xl bg-base-100 md:grid-cols-2"
        whileHover={{ scale: 1.01 }}
      >
        <input
          name="name"
          type="text"
          placeholder="Court Name"
          className="w-full input input-bordered"
        />
        <input
          name="type"
          type="text"
          placeholder="Type (e.g. Tennis)"
          className="w-full input input-bordered"
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full file-input file-input-bordered"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full input input-bordered"
        />
        <button
          type="submit"
          className="shadow-md col-span-full btn btn-accent rounded-xl"
        >
          ➕ Add Court
        </button>
      </motion.form>

      {/* Court Table */}
      <div className="mt-10 overflow-x-auto shadow-md rounded-2xl bg-base-100">
        <table className="table w-full table-zebra">
          <thead className="text-white bg-gradient-to-r from-orange-500 to-yellow-400">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  <span className="text-orange-500 loading loading-spinner"></span>
                </td>
              </tr>
            ) : courts.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  No courts found.
                </td>
              </tr>
            ) : (
              courts.map((court) => (
                <motion.tr
                  key={court._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className=""
                >
                  <td>
                    <img
                      src={court.image}
                      alt="court"
                      className="object-cover w-16 h-12 rounded-lg shadow-sm"
                    />
                  </td>
                  <td className="font-medium">{court.name}</td>
                  <td>{court.type}</td>
                  <td>${court.price}</td>
                  <td>
                    <select
                      className="w-full select select-bordered select-sm"
                      value={court.status}
                      onChange={(e) =>
                        statusMutation.mutate({
                          id: court._id,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                      <option value="Under Maintenance">
                        Under Maintenance
                      </option>
                    </select>
                  </td>
                  <td className="flex justify-center gap-2">
                    <button
                      className="rounded-lg shadow btn btn-sm btn-info"
                      onClick={() => handleEditNavigate(court)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg shadow btn btn-sm btn-error"
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#e74c3c",
                          cancelButtonColor: "#95a5a6",
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
