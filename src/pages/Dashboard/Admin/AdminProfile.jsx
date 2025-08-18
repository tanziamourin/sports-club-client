import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  FiUsers, FiHome, FiStar, FiActivity, FiCalendar, FiDollarSign,
  FiEdit, FiPhone, FiMapPin
} from "react-icons/fi";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // Fetch stats dynamically
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const bookingsRes = await axiosSecure.get("/admin/bookings/confirmed");
      const usersRes = await axiosSecure.get("/admin/users");
      const courtsRes = await axiosSecure.get("/courts");

      const totalBookings = bookingsRes.data.length;
      const users = usersRes.data || [];
      const totalUsers = users.length;
      const totalMembers = users.filter(u => u.role === "member").length;
      const totalCourts = courtsRes.data.length;
      const monthlyRevenue = bookingsRes.data.reduce((acc, b) => acc + (b.price || 0), 0);

      return {
        totalBookings,
        totalUsers,
        totalMembers,
        totalCourts,
        monthlyRevenue,
        activeBookings: totalBookings,
        activeSessions: totalBookings
      };
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const statsData = [
    { label: "Total Courts", value: stats.totalCourts || 30, icon: <FiHome />, color: "var(--color-primary)" },
    { label: "Total Users", value: stats.totalUsers || 0, icon: <FiUsers />, color: "var(--color-success)" },
    { label: "Total Members", value: stats.totalMembers || 0, icon: <FiStar />, color: "var(--color-secondary)" },
    { label: "Active Bookings", value: stats.activeBookings || 0, icon: <FiCalendar />, color: "var(--color-accent)" },
    { label: "Monthly Revenue", value: `$${stats.monthlyRevenue?.toLocaleString() || 0}`, icon: <FiDollarSign />, color: "var(--color-success)" },
    { label: "Active Sessions", value: stats.activeSessions || 20, icon: <FiActivity />, color: "var(--color-primary)" }
  ];

  return (
    <div className="relative min-h-screen bg-[var(--color-background)] overflow-hidden">
      {/* Wave design */}
      <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full text-white transform scale-x-125 dark:text-gray-800" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      </div>

      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="relative z-10 pt-12 pb-6">
        <div className="px-6 mx-auto max-w-7xl">
          {/* Profile Header */}
          <motion.div variants={itemVariants} className="flex flex-col items-center p-8 mb-8 border border-gray-200 shadow-lg bg-surface rounded-2xl dark:bg-gray-800/90 backdrop-blur-sm dark:border-gray-700">
            <motion.div whileHover={{ scale: 1.05 }} className="relative mb-4 group">
              <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-r from-indigo-500 to-purple-600 blur-md"></div>
              <img src={user?.photoURL || "https://i.ibb.co/ck1SGFJ/profile-placeholder.png"} alt="Admin" className="relative z-10 object-cover w-32 h-32 border-4 border-indigo-500 rounded-full shadow-lg dark:border-indigo-400" />
              <button className="absolute bottom-0 right-0 z-20 p-2 transition-all bg-white rounded-full shadow-md opacity-0 dark:bg-gray-700 group-hover:opacity-100">
                <FiEdit className="text-indigo-600 dark:text-indigo-400" />
              </button>
            </motion.div>

            <h2 className="mb-1 text-2xl font-bold text-[var(--color-text-primary)]">{user?.displayName || "Admin"}</h2>
            <p className="mb-2 text-[var(--color-primary)]">{user?.email}</p>
            <p className="mb-4 text-sm text-[var(--color-text-secondary)]">Role: Administrator</p>

            {/* Contact & Address */}
            <div className="flex flex-col mb-4 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <FiPhone /> <span>{user?.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <FiMapPin /> <span>{user?.address || "N/A"}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 text-sm rounded-full bg-[var(--color-primary)] text-[var(--color-background)]">Administrator</span>
              <span className="px-3 py-1 text-sm rounded-full bg-[var(--color-success)] text-[var(--color-background)]">Verified</span>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={containerVariants} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {statsData.map((stat, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -5 }} className="p-6 border-b border-l-4 border-r shadow-sm rounded-xl" style={{ borderColor: stat.color, backgroundColor: "var(--color-surface)", color: "var(--color-text-primary)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">{stat.label}</p>
                    <p className="mt-1 text-3xl font-semibold">{isLoading ? <span className="inline-block w-16 h-8 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></span> : stat.value}</p>
                  </div>
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${stat.color}22` }}>{stat.icon}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminProfile;
