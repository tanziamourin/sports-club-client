import React from "react";

const EditProfileModal = ({ formData, setFormData, onClose }) => {
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ Since we're using local state only, just close the modal after form submit.
    // (If there were an API, the call would go here.)
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg p-6 bg-white rounded-xl dark:bg-gray-800">
        <h3 className="mb-8 text-4xl font-bold lg:text-5xl" style={{color:"var(--color-primary)"}}>Edit Profile</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div>
            <label className="text-sm">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 mt-1 rounded-md bg-gray-50 dark:bg-gray-700"
            />
          </div>

          {/* Phone field */}
          <div>
            <label className="text-sm">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full p-2 mt-1 rounded-md bg-gray-50 dark:bg-gray-700"
            />
          </div>

          {/* Location field */}
          <div>
            <label className="text-sm">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full p-2 mt-1 rounded-md bg-gray-50 dark:bg-gray-700"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 rounded-md dark:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm text-white rounded-md bg-primary-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
