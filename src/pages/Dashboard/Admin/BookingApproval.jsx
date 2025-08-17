import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../context/AuthContext";
import {
  FiClock,
  FiCheck,
  FiX,
  FiCalendar,
  FiUser,
  FiMapPin,
  FiAlertCircle,
  FiLoader,
  FiChevronRight,
  FiDollarSign,
  FiInfo,
} from "react-icons/fi";
import { motion } from "framer-motion";

const BookingApproval = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { refetchRole } = useContext(AuthContext);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["pendingBookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings/pending");
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) =>
      await axiosSecure.patch(`/admin/bookings/approve/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingBookings"]);
      refetchRole();
      Swal.fire({
        title: "Approved!",
        text: "Booking approved successfully",
        icon: "success",
        confirmButtonColor: "#4CAF50",
        background: "#ffffff",
        color: "#1a1a1a",
        customClass: {
          popup: "shadow-lg rounded-xl",
        },
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) =>
      await axiosSecure.delete(`/admin/bookings/reject/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingBookings"]);
      Swal.fire({
        title: "Rejected!",
        text: "Booking has been rejected",
        icon: "info",
        confirmButtonColor: "#F44336",
        background: "#ffffff",
        color: "#1a1a1a",
        customClass: {
          popup: "shadow-lg rounded-xl",
        },
      });
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="p-4 rounded-full bg-primary/10"
          >
            <FiLoader className="w-10 h-10 text-primary" />
          </motion.div>
          <span className="mt-4 text-lg font-medium text-primary">
            Loading requests...
          </span>
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div
          
          className="relative p-8 mb-10 overflow-hidden text-white shadow-lg rounded-2xl bg-gradient-to-r from-primary to-secondary"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'url("https://grainy-graphics.vercel.app/noise.svg")',
            }}
          ></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold md:text-5xl">
              Booking Approvals
            </h1>
            <p className="mt-2 text-lg opacity-90">
              Review and manage pending booking requests
            </p>
            <div className="flex items-center px-4 py-3 mt-6 border bg-white/10 backdrop-blur-sm rounded-xl max-w-max border-white/20">
              <FiClock className="mr-3 text-xl" />
              <span className="font-medium">
                {bookings.length} pending{" "}
                {bookings.length === 1 ? "request" : "requests"}
              </span>
            </div>
          </div>
        </div>

        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-5 text-center bg-white border border-gray-100 shadow-lg rounded-2xl"
          >
            <div className="p-5 mb-6 rounded-full bg-primary/10">
              <FiAlertCircle className="w-12 h-12 text-primary" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              No pending bookings
            </h3>
            <p className="max-w-md text-gray-500">
              All booking requests have been processed. Check back later for new
              requests.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                whileHover={{ y: -3 }}
                className="flex flex-col justify-start overflow-hidden transition-all bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md hover:border-primary/30"
              >
                {/* Header */}
                <div className="relative p-4 pb-0">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <FiCalendar className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {b.courtType} Booking
                      </h3>
                      <p className="text-sm text-gray-500">
                        Requested on{" "}
                        {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status + Price */}
                <div className="flex items-center justify-between px-4 mt-2">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                    {b.status.toUpperCase()}
                  </span>
                  <div className="flex items-center text-lg font-bold text-black">
                    <FiDollarSign className="w-4 h-4 mr-1 " />{" "}
                    {b.price}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 gap-3 p-4">
                  {/* user */}
                  <div className="flex items-center p-2 rounded-lg bg-gray-50">
                    <FiUser className="mr-2 text-blue-600" />
                    <span className="text-sm text-black truncate">{b.userEmail}</span>
                  </div>
                  {/* court */}
                  <div className="flex items-center p-2 rounded-lg bg-gray-50">
                    <FiMapPin className="mr-2 text-green-600" />
                    <span className="text-sm text-black truncate">{b.courtType}</span>
                  </div>
                  {/* date */}
                  <div className="flex items-center p-2 rounded-lg bg-gray-50">
                    <FiCalendar className="mr-2 text-purple-600" />
                    <span className="text-sm text-black">
                      {new Date(b.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {/* slot */}
                  <div className="flex items-center p-2 rounded-lg bg-gray-50">
                    <FiClock className="mr-2 text-amber-800" />
                    <span className="text-sm text-black">{b.slot}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => approveMutation.mutate(b._id)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      <FiCheck className="inline-block mr-1" /> Approve
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => rejectMutation.mutate(b._id)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      <FiX className="inline-block mr-1" /> Reject
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingApproval;
