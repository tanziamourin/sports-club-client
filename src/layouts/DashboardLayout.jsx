import { useContext, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FiLogOut, FiMenu, FiX, FiHome, FiUser, FiUsers, FiBook,
  FiSettings, FiCreditCard, FiBell, FiList
} from "react-icons/fi";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

const DashboardLayout = () => {
  const { logout, role } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout().catch((err) => console.error(err));
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinkStyle =
    "flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition";

  const renderLink = (to, icon, label) => (
    <NavLink
      to={to}
      onClick={() => setMenuOpen(false)}
      className={({ isActive }) =>
        `${navLinkStyle} ${isActive ? "bg-slate-700 text-white font-semibold" : "text-gray-300"}`
      }
    >
      {icon} {label}
    </NavLink>
  );

  const renderSidebarLinks = () => {
    if (role === "admin") {
      return (
        <>
          {renderLink("/", <FiHome />, "Home")}
          {renderLink("/dashboard/admin/profile", <FiUser />, "Admin Profile")}
          {renderLink("/dashboard/admin/bookings", <FiBook />, "Booking Approval")}
          {renderLink("/dashboard/admin/members", <FiUsers />, "Manage Members")}
          {renderLink("/dashboard/admin/users", <FiUsers />, "All Users")}
          {renderLink("/dashboard/admin/courts", <FiSettings />, "Manage Courts")}
          {renderLink("/dashboard/admin/confirmed", <FiList />, "Confirmed Bookings")}
          {renderLink("/dashboard/admin/coupons", <FiCreditCard />, "Manage Coupons")}
          {renderLink("/dashboard/admin/announcements", <FiBell />, "Announcements")}
        </>
      );
    } else if (role === "member") {
      return (
        <>
          {renderLink("/", <FiHome />, "Home")}
          {renderLink("/dashboard/member/profile", <FiUser />, "My Profile")}
          {renderLink("/dashboard/member/pending", <FiBook />, "Pending Bookings")}
          {renderLink("/dashboard/member/approved", <FiBook />, "Approved Bookings")}
          {renderLink("/dashboard/member/confirmed", <FiList />, "Confirmed Bookings")}
          {renderLink("/dashboard/member/history", <FiCreditCard />, "Payment History")}
          {renderLink("/dashboard/member/announcements", <FiBell />, "Announcements")}
        </>
      );
    } else {
      return (
        <>
          {renderLink("/", <FiHome />, "Home")}
          {renderLink("/dashboard/user/profile", <FiUser />, "My Profile")}
          {renderLink("/dashboard/user/pending", <FiBook />, "Pending Bookings")}
          {renderLink("/dashboard/user/bookings", <FiList />, "Bookings")}
          {renderLink("/dashboard/user/announcements", <FiBell />, "Announcements")}
        </>
      );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)] relative">
      {/* ✅ Toggle Icon - Fixed on top-left mobile only */}
      <div className="fixed z-50 top-4 left-4 lg:hidden">
        <button
          onClick={toggleMenu}
          className="p-2 text-2xl text-white rounded-full shadow-lg bg-slate-800"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 bg-slate-800 text-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          h-screen flex flex-col justify-between
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        <div className="flex-1 p-6 overflow-y-auto">
        

          <h2 className="mb-4 text-2xl font-bold">🏸 Dashboard</h2>
          {renderSidebarLinks()}
        </div>

        <div className="p-6 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <motion.main
        className="flex-1 h-screen p-4 ml-0 overflow-y-auto lg:ml-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
