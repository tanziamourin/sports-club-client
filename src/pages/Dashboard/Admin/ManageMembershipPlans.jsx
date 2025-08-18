import { React, useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaSearch,
} from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";


const ManageMembershipPlans = () => {
 
  const API_BASE = "/admin/membership-plans";
  const axiosInstance = useAxios();

  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "monthly",
    features: [],
    description: "",
    isFeatured: false,
    active: true,
  });
  const [newFeature, setNewFeature] = useState("");

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_BASE);
      const plansData = Array.isArray(response?.data) ? response.data : [];
      setPlans(plansData);
      setFilteredPlans(plansData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch plans");
      setPlans([]);
      setFilteredPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPlans(plans);
    } else {
      const filtered = plans.filter((plan) =>
        plan.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlans(filtered);
    }
  }, [searchTerm, plans]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddFeature = () => {
    if (
      newFeature.trim() &&
      !formData.features.includes(newFeature.trim())
    ) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (i) => {
    const features = [...formData.features];
    features.splice(i, 1);
    setFormData({ ...formData, features });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await axiosInstance.put(
          `${API_BASE}/${editingId}`,
          { ...formData, _id: editingId }
        );
        toast.success("Plan updated successfully");
      } else {
        await axiosInstance.post(API_BASE, formData);
        toast.success("Plan created successfully");
      }
      resetForm();
      await fetchPlans();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Put current plan values on the form
  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      description: plan.description,
      features: plan.features,
      isFeatured: plan.isFeatured,
      active: plan.active,
    });
    setEditingId(plan._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this plan?")) {
      try {
        setIsDeleting(true);
        await axiosInstance.delete(`${API_BASE}/${id}`);
        toast.success("Plan deleted");
        await fetchPlans();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const togglePlanStatus = async (id, currentStatus) => {
    try {
      setIsToggling(true);
      await axiosInstance.patch(`${API_BASE}/${id}/status`, {
        active: !currentStatus,
      });
      toast.success(
        currentStatus ? "Plan deactivated" : "Plan activated"
      );
      await fetchPlans();
    } catch (error) {
      toast.error("Failed to update plan status");
    } finally {
      setIsToggling(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      duration: "monthly",
      features: [],
      description: "",
      isFeatured: false,
      active: true,
    });
    setEditingId(null);
  };

  return (
    <div
      className="container px-4 py-8 mx-auto"
      style={{ color: "var(--color-text-primary)" }}
    >
    

      <h1 className="mb-8 text-4xl font-bold lg:text-5xl" style={{color:"var(--color-primary)"}}>
        {editingId ? "Edit Membership Plan" : "Manage Membership Plans"}
      </h1>

      {/* Search */}
      <div className="flex mb-6">
        <div className="relative w-full">
          <FaSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            placeholder="Search plans..."
            className="w-full px-4 py-2 pl-10 border rounded-lg"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-secondary)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>
      </div>

      {/* Form */}
      <motion.div
        key={editingId || "new"}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 mb-8 shadow rounded-xl"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-secondary)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1">Plan Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-secondary)",
                  color: "var(--color-text-primary)",
                }}
              />
            </div>
            <div>
              <label className="block mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-secondary)",
                  color: "var(--color-text-primary)",
                }}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block mb-1">Duration *</label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-secondary)",
                color: "var(--color-text-primary)",
              }}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Features */}
          <div>
            <label className="block mb-1">Features *</label>
            <div className="flex mb-2">
              <input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                type="text"
                className="flex-1 px-4 py-2 border rounded-l-lg"
                placeholder="Add feature"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-secondary)",
                  color: "var(--color-text-primary)",
                }}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 text-white rounded-r-lg"
                style={{ background: "var(--color-primary)" }}
              >
                <FaPlus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((f, i) => (
                <span
                  key={i}
                  className="flex items-center px-3 py-1 rounded-full"
                  style={{
                    background: "var(--color-background)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {f}
                  <button
                    type="button"
                    className="ml-2 text-red-600"
                    onClick={() => handleRemoveFeature(i)}
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1">Description *</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-secondary)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
              />
              Featured
            </label>
            {editingId && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                />
                Active
              </label>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white rounded-lg"
              style={{ background: "var(--color-primary)" }}
            >
              {isSubmitting && <FaSpinner className="mr-2 animate-spin" />}
              {editingId ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="text-4xl animate-spin" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : filteredPlans.length === 0 ? (
        <p className="text-center">No membership plans found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col p-6 border shadow-md rounded-xl"
              style={{
                background: "var(--color-surface)",
                borderColor: plan.isFeatured
                  ? "var(--color-primary)"
                  : "var(--color-secondary)",
                opacity: plan.active ? 1 : 0.7,
              }}
            >
              {plan.isFeatured && (
                <div
                  className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white"
                  style={{ background: "var(--color-primary)" }}
                >
                  FEATURED
                </div>
              )}

              <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>

              <span
                className="px-2 py-1 mb-3 text-xs rounded-full"
                style={{
                  background: plan.active
                    ? "var(--color-success)"
                    : "var(--color-secondary)",
                  color: "white",
                }}
              >
                {plan.active ? "Active" : "Inactive"}
              </span>

              <p className="mb-4">{plan.description}</p>

              <p className="mb-2">
                <span
                  style={{ color: "var(--color-primary)" }}
                  className="text-lg font-bold"
                >
                  ${plan.price}
                </span>{" "}
                /{plan.duration}
              </p>

              <ul className="mb-4">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center">
                    <FaCheck
                      className="mr-2"
                      style={{ color: "var(--color-success)" }}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  <FaEdit className="inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  <FaTrash className="inline mr-2" />
                  Delete
                </button>
              </div>

              <button
                onClick={() => togglePlanStatus(plan._id, plan.active)}
                className="w-full py-2 mt-3 rounded-lg"
                style={{
                  background: plan.active ? "#FCA5A5" : "#4ADE80",
                  color: "var(--color-text-primary)",
                }}
              >
                {plan.active ? "Deactivate Plan" : "Activate Plan"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMembershipPlans;
