import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const ManageCourts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const imageHostKey = import.meta.env.VITE_image_upload_key;
  const navigate = useNavigate();

  const { data: courts = [], isLoading } = useQuery({
    queryKey: ["courts"],
    queryFn: async () => (await axiosSecure.get("/courts/all")).data,
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
    mutationFn: async ({ id, status }) => await axiosSecure.patch(`/courts/${id}/status`, { status }),
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

    const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${imageHostKey}`, { method: "POST", body: formData });
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

  const handleEditNavigate = (court) => navigate(`/dashboard/admin/courts/edit/${court._id}`, { state: court });

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="mb-8 text-4xl font-bold text-[var(--color-primary)]">Manage Courts</h2>

      {/* Add Court Form */}
      <motion.form
        onSubmit={handleAdd}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 mb-10 bg-[var(--color-surface)] shadow-lg rounded-2xl"
      >
        <input name="name" type="text" placeholder="Court Name" className="input input-bordered rounded-xl" />
        <input name="type" type="text" placeholder="Type (e.g. Tennis)" className="input input-bordered rounded-xl" />
        <input name="price" type="number" placeholder="Price" className="input input-bordered rounded-xl" />
        <input name="image" type="file" accept="image/*" className="file-input file-input-bordered rounded-xl" />
        <button
          type="submit"
          className="col-span-full py-2 rounded-2xl text-white font-semibold hover:scale-[1.02] transition"
          style={{ background: "var(--color-primary)" }}
        >
          ➕ Add Court
        </button>
      </motion.form>

      {/* Courts Cards */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner text-[var(--color-primary)]"></span>
        </div>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {courts.map((court) => (
            <motion.div
              key={court._id}
              variants={cardVariants}
              whileHover={{ y: -3, boxShadow: "0px 6px 14px rgba(0,0,0,0.08)" }}
              className="flex flex-col bg-[var(--color-surface)] border border-[var(--color-secondary)] rounded-2xl shadow-md overflow-hidden transition"
            >
              <img src={court.image} alt={court.name} className="object-cover w-full h-44" />
              <div className="flex-grow p-4 space-y-2">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{court.name}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{court.type}</p>
                <p className="font-semibold">${court.price}</p>

                {/* Status Badge */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    court.status === "Available"
                      ? "bg-green-100 text-green-600"
                      : court.status === "Unavailable"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {court.status}
                </span>
              </div>

              <div className="flex gap-2 p-4">
                <button
                  className="flex-1 py-2 rounded-xl border hover:bg-[var(--color-primary)] hover:text-white transition"
                  onClick={() => handleEditNavigate(court)}
                >
                  Edit
                </button>
                <button
                  className="flex-1 py-2 transition border rounded-xl hover:bg-red-500 hover:text-white"
                  onClick={() =>
                    Swal.fire({
                      title: "Delete this court?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes",
                    }).then((result) => {
                      if (result.isConfirmed) deleteMutation.mutate(court._id);
                    })
                  }
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageCourts;
