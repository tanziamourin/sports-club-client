import { useContext, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FiLogOut, FiMenu, FiX, FiHome, FiUser, FiUsers, FiBook,
  FiSettings, FiCreditCard, FiBell, FiList
} from "react-icons/fi";
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
      onClick={() => setMenuOpen(false)} // menu will auto-close on click
      className={({ isActive }) =>
        `${navLinkStyle} ${
          isActive ? "bg-slate-700 text-white font-semibold" : "text-gray-300"
        }`
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMenu}
        className="fixed z-50 p-2 text-2xl text-gray-800 lg:hidden top-4 left-4"
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-slate-800 shadow-md text-white transform
          transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        <div className="p-6">
          <h2 className="mb-6 text-2xl font-bold text-white">🏸 Dashboard</h2>
         <div className="items-end space-y-50"> 
           <div className="flex flex-col space-y-1">{renderSidebarLinks()}</div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            <FiLogOut /> Logout
          </button>
         </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
