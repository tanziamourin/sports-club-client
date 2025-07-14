import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";

const ManageCourts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const imageHostKey = import.meta.env.VITE_image_upload_key;

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    type: "",
    image: null,
    price: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  const { data: courts = [], isLoading } = useQuery({
    queryKey: ["courts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/courts/all"); // fetch full list
      return res.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newCourt) => await axiosSecure.post("/courts", newCourt),
    onSuccess: () => {
      queryClient.invalidateQueries(["courts"]);
      Swal.fire("✅ Court Added!", "", "success");
      setFormData({ name: "", type: "", image: null, price: "" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedCourt) =>
      await axiosSecure.patch(`/courts/${updatedCourt._id}`, updatedCourt),
    onSuccess: () => {
      queryClient.invalidateQueries(["courts"]);
      Swal.fire("✅ Court Updated!", "", "success");
      setIsEditing(false); // Close the edit form
      setFormData({ name: "", type: "", image: null, price: "" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, type, image, price } = formData;

    if (!name || !type || !price || !image) {
      return Swal.fire("⚠️ Fill all fields!", "", "warning");
    }

    const imageFile = new FormData();
    imageFile.append("image", image);

    const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${imageHostKey}`, {
      method: "POST",
      body: imageFile,
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
      if (isEditing) {
        updateMutation.mutate({ ...courtData, _id: formData._id });
      } else {
        addMutation.mutate(courtData);
      }
    } else {
      Swal.fire("❌ Image upload failed!", "", "error");
    }
  };

  const handleEdit = (court) => {
    setFormData(court);
    setIsEditing(true);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Manage Courts</h2>

      {/* Add/Edit Court Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 p-4 rounded md:grid-cols-2 bg-base-200"
      >
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
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          className="file-input file-input-bordered"
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="input input-bordered"
        />
        <button type="submit" className="btn btn-primary col-span-full">
          {isEditing ? "Update Court" : "Add Court"}
        </button>
      </form>

      {/* Court List */}
      <div className="mt-6 overflow-x-auto">
        <table className="table w-full">
          <thead>
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
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            ) : (
              courts.map((court) => (
                <tr key={court._id}>
                  <td>
                    <img src={court.image} className="object-cover w-16 h-12" />
                  </td>
                  <td>{court.name}</td>
                  <td>{court.type}</td>
                  <td>${court.price}</td>
                  <td>
                    <select
                      className="select select-sm select-bordered"
                      value={court.status}
                      onChange={(e) =>
                        statusMutation.mutate({ id: court._id, status: e.target.value })
                      }
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleEdit(court)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, delete it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteMutation.mutate(court._id);
                          }
                        });
                      }}
                    >
                      Delete
                    </button>
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

export default ManageCourts;
