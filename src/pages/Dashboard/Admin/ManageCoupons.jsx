import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";

const ManageCoupons = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ code: "", discount: "" });
  const [editId, setEditId] = useState(null);

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/coupons");
      return res.data;
    }
  });

  const addMutation = useMutation({
    mutationFn: async (newCoupon) => await axiosSecure.post("/coupons", newCoupon),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      Swal.fire("✅ Coupon Added", "", "success");
      setFormData({ code: "", discount: "" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => await axiosSecure.patch(`/coupons/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      Swal.fire("✅ Coupon Updated", "", "success");
      setFormData({ code: "", discount: "" });
      setEditId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      Swal.fire("🗑️ Deleted", "Coupon removed", "info");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount) return;
    if (editId) {
      updateMutation.mutate({ id: editId, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Manage Coupons</h2>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 md:flex-row">
        <input
          type="text"
          placeholder="Coupon Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="input input-bordered"
        />
        <input
          type="number"
          placeholder="Discount %"
          value={formData.discount}
          onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
          className="input input-bordered"
        />
        <button type="submit" className="btn btn-primary">
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button onClick={() => {
            setEditId(null);
            setFormData({ code: "", discount: "" });
          }} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </form>

      {/* Coupons List */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount (%)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="3">Loading...</td></tr>
            ) : (
              coupons.map(coupon => (
                <tr key={coupon._id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.discount}%</td>
                  <td className="flex gap-2">
                    <button onClick={() => {
                      setFormData({ code: coupon.code, discount: coupon.discount });
                      setEditId(coupon._id);
                    }} className="btn btn-sm btn-info">Edit</button>
                    <button onClick={() => {
                      Swal.fire({
                        title: "Delete?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes"
                      }).then(result => {
                        if (result.isConfirmed) deleteMutation.mutate(coupon._id);
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

export default ManageCoupons;
