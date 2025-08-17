import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState, useContext } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";


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
    },
  });

  const showSuccessAlert = (title) => {
    Swal.fire({
      title,
      icon: "success",
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
      confirmButtonColor: "var(--color-primary)",
    });
  };

  const addMutation = useMutation({
    mutationFn: async (newCoupon) => await axiosSecure.post("/coupons", newCoupon),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      showSuccessAlert("✅ Coupon Added!");
      setFormData({ code: "", discount: "" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) =>
      await axiosSecure.patch(`/coupons/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      showSuccessAlert("✅ Coupon Updated!");
      setFormData({ code: "", discount: "" });
      setEditId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      Swal.fire("🗑️ Deleted", "Coupon removed", "info");
    },
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
    <div
      className={`p-6 min-h-screen transition-colors duration-300 `}
    >
      <h2 className="mb-10 text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">
        Manage Coupons
      </h2>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 mb-8 md:flex-row"
      >
        <input
          type="text"
          placeholder="Coupon Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className={`w-full max-w-xs input rounded-xl shadow-sm border `}
        />
        <input
          type="number"
          placeholder="Discount %"
          value={formData.discount}
          onChange={(e) =>
            setFormData({ ...formData, discount: e.target.value })
          }
          className={`w-full max-w-xs input rounded-xl shadow-sm border `}
        />
        <button
          type="submit"
          className="px-6 text-white transition shadow btn rounded-xl btn-primary opacity-90"
        >
          {editId ? "Update Coupon" : "Add Coupon"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({ code: "", discount: "" });
            }}
            className="px-6 text-gray-600 transition border border-gray-400 shadow btn rounded-xl hover:bg-gray-600 hover:text-white"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Coupons List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-xl shadow `}
                >
                  <span className="text-orange-500 loading loading-spinner"></span>
                </motion.div>
              ))
            : coupons.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center text-gray-400 col-span-full"
                >
                  No coupons found
                </motion.div>
              )}
          {coupons.map((coupon) => (
            <motion.div
              key={coupon._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-xl shadow flex justify-between items-center transition-colors `}
            >
              <div>
                <p className="text-lg font-bold">{coupon.code}</p>
                <p className="text-sm text-gray-500">{coupon.discount}% Discount</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormData({ code: coupon.code, discount: coupon.discount });
                    setEditId(coupon._id);
                  }}
                  className="text-white transition bg-yellow-400 rounded-lg shadow btn btn-sm hover:bg-yellow-500"
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
                      confirmButtonColor: "#e74c3c",
                    }).then((result) => {
                      if (result.isConfirmed) deleteMutation.mutate(coupon._id);
                    });
                  }}
                  className="text-white transition bg-red-500 rounded-lg shadow btn btn-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageCoupons;
