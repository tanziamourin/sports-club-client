import { React, useState, useEffect, useContext } from 'react';
import { 
  FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner, FaSearch
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAxios from '../../../hooks/useAxios';
// import ThemeContext from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

const ManageMembershipPlans = () => {

  const API_BASE = '/admin/membership-plans';
  const axiosInstance = useAxios();

  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: 'monthly',
    features: [],
    description: '',
    isFeatured: false,
    active: true
  });
  const [newFeature, setNewFeature] = useState('');

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_BASE);
      const plansData = Array.isArray(response?.data) ? response.data : [];
      setPlans(plansData);
      setFilteredPlans(plansData);
    } catch (error) {
      console.error('Fetch plans error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch plans');
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
    if (!searchTerm.trim()) setFilteredPlans(plans);
    else {
      const filtered = plans.filter(plan =>
        plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlans(filtered);
    }
  }, [searchTerm, plans]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await axiosInstance.put(`${API_BASE}/${editingId}`, formData);
        toast.success('Plan updated successfully');
      } else {
        await axiosInstance.post(API_BASE, formData);
        toast.success('Plan created successfully');
      }
      resetForm();
      await fetchPlans();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name || '',
      price: plan.price || '',
      duration: plan.duration || 'monthly',
      features: Array.isArray(plan.features) ? plan.features : [],
      description: plan.description || '',
      isFeatured: plan.isFeatured || false,
      active: plan.active || false
    });
    setEditingId(plan._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        setIsDeleting(true);
        await axiosInstance.delete(`${API_BASE}/${id}`);
        toast.success('Plan deleted successfully');
        await fetchPlans();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete plan');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const togglePlanStatus = async (id, currentStatus) => {
    try {
      setIsToggling(true);
      await axiosInstance.patch(`${API_BASE}/${id}/status`, { active: !currentStatus });
      toast.success(`Plan ${currentStatus ? 'deactivated' : 'activated'}`);
      await fetchPlans();
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error(error.response?.data?.message || 'Failed to update plan status');
    } finally {
      setIsToggling(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      duration: 'monthly',
      features: [],
      description: '',
      isFeatured: false,
      active: true
    });
    setEditingId(null);
  };

  return (
    <div className="container px-4 py-8 mx-auto" style={{ color: 'var(--color-text-primary)' }}>
      
      

      <h1 className="mb-6 text-3xl font-bold">
        {editingId ? 'Edit Membership Plan' : 'Manage Membership Plans'}
      </h1>

      {/* Search */}
      <div className="flex mb-6">
        <div className="relative flex-grow">
          <FaSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plans..."
            className="w-full px-4 py-2 pl-10 border rounded-lg"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-secondary)',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 mb-8 shadow rounded-xl"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-secondary)'
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
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-secondary)',
                  color: 'var(--color-text-primary)'
                }}
              />
            </div>
            <div>
              <label className="block mb-1">Price (USD) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-2 border rounded-lg"
                style={{
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-secondary)',
                  color: 'var(--color-text-primary)'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Duration *</label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-secondary)',
                color: 'var(--color-text-primary)'
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
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-l-lg"
                placeholder="Add feature"
                style={{
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-secondary)',
                  color: 'var(--color-text-primary)'
                }}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 text-white rounded-r-lg"
                style={{ background: 'var(--color-primary)' }}
              >
                <FaPlus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, i) => (
                <span
                  key={i}
                  className="flex items-center px-3 py-1 rounded-full"
                  style={{
                    background: 'var(--color-background)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {feature}
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
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-secondary)',
                color: 'var(--color-text-primary)'
              }}
              required
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
              Featured Plan
            </label>
            {editingId && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                />
                Active Plan
              </label>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
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
              style={{ background: 'var(--color-primary)' }}
            >
              {isSubmitting && <FaSpinner className="mr-2 animate-spin" />}
              {editingId ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Plans List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="text-4xl animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="py-12 text-center">
          <p>No membership plans found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-6 overflow-hidden border shadow-md rounded-xl"
              style={{
                background: 'var(--color-surface)',
                borderColor: plan.isFeatured ? 'var(--color-primary)' : 'var(--color-secondary)',
                opacity: plan.active ? 1 : 0.7
              }}
            >
              {plan.isFeatured && (
                <div
                  className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white"
                  style={{ background: 'var(--color-primary)' }}
                >
                  FEATURED
                </div>
              )}

              <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
              <span
                className={`px-2 py-1 text-xs rounded-full mb-4`}
                style={{
                  background: plan.active ? 'var(--color-success)' : 'var(--color-secondary)',
                  color: 'white'
                }}
              >
                {plan.active ? 'Active' : 'Inactive'}
              </span>
              <p className="mb-4">{plan.description}</p>
              <div className="mb-4">
                <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  ${plan.price}
                </span>
                <span className="ml-1 text-sm">/{plan.duration}</span>
              </div>
              <ul className="mb-4">
                {(plan.features || []).map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <FaCheck className="mr-2" style={{ color: 'var(--color-success)' }} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                <button onClick={() => handleEdit(plan)} className="flex-1 px-4 py-2 border rounded-lg">
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button onClick={() => handleDelete(plan._id)} className="flex-1 px-4 py-2 border rounded-lg">
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>

              <button
                onClick={() => togglePlanStatus(plan._id, plan.active)}
                className="w-full py-2 mt-3 rounded-lg"
                style={{
                  background: plan.active ? '#FCA5A5' : '#4ADE80',
                  color: 'var(--color-text-primary)'
                }}
              >
                {plan.active ? 'Deactivate Plan' : 'Activate Plan'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMembershipPlans;
