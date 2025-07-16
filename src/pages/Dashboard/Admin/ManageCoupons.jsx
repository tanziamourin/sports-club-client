import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";
import "animate.css";

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

  const showSuccessAlert = (title) => {
    Swal.fire({
      title,
      icon: "success",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      confirmButtonColor: "var(--color-primary)",
    });
  };

  const addMutation = useMutation({
    mutationFn: async (newCoupon) => await axiosSecure.post("/coupons", newCoupon),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      showSuccessAlert("✅ Coupon Added!");
      setFormData({ code: "", discount: "" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => await axiosSecure.patch(`/coupons/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      showSuccessAlert("✅ Coupon Updated!");
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
    if (!formData.code || !formData.discount) {
      return Swal.fire("⚠️ Fill in all fields", "", "warning");
    }

    if (editId) {
      updateMutation.mutate({ id: editId, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-[var(--color-background)]">
      <h2 className="mb-8 my-11 text-center text-4xl font-bold text-[var(--color-primary)]">
        Manage Coupons
      </h2>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4 mb-6 md:flex-row">
        <input
          type="text"
          placeholder="Coupon Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="w-full max-w-xs input input-bordered"
        />
        <input
          type="number"
          placeholder="Discount %"
          value={formData.discount}
          onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
          className="w-full max-w-xs input input-bordered"
        />
        <button
          type="submit"
          className="btn text-white bg-[var(--color-primary)] hover:bg-orange-700"
        >
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({ code: "", discount: "" });
            }}
            className="btn btn-outline text-[var(--color-secondary)] border-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Coupons List */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="table w-full">
          <thead className="bg-[var(--color-secondary)] text-white text-base">
            <tr>
              <th>Code</th>
              <th>Discount (%)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-[var(--color-text-primarys)]">
            {isLoading ? (
              <tr><td colSpan="3" className="py-6 text-center">Loading...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan="3" className="py-6 text-center text-gray-500">No coupons found</td></tr>
            ) : (
              coupons.map(coupon => (
                <tr key={coupon._id} className=" border border-gray-300 hover:bg-[#FFFAF0] transition-all">
                  <td className="font-medium">{coupon.code}</td>
                  <td>{coupon.discount}%</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => {
                        setFormData({ code: coupon.code, discount: coupon.discount });
                        setEditId(coupon._id);
                      }}
                      className="text-white bg-yellow-400 btn btn-sm hover:bg-yellow-500"
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
                          if (result.isConfirmed) deleteMutation.mutate(coupon._id);
                        });
                      }}
                      className="text-white bg-red-500 btn btn-sm hover:bg-red-600"
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

export default ManageCoupons;
