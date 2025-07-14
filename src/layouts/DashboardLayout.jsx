// src/layouts/DashboardLayout.jsx
import { useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

const DashboardLayout = () => {
  const {  logout, role } = useContext(AuthContext);

  const handleLogout = () => {
    logout().catch((err) => console.error(err));
  };

  // Sidebar items per role
  const renderSidebarLinks = () => {
    if (role === "admin") {
      return (
        <>
         <NavLink to="/" className="mx-2">Home</NavLink>
          <NavLink to="/dashboard/admin/profile">Admin Profile</NavLink>
          <NavLink to="/dashboard/admin/bookings">Booking Approval</NavLink>
          <NavLink to="/dashboard/admin/members">Manage Members</NavLink>
          <NavLink to="/dashboard/admin/users">All Users</NavLink>
          <NavLink to="/dashboard/admin/courts">Manage Courts</NavLink>
          <NavLink to="/dashboard/admin/confirmed">Confirmed Bookings</NavLink>
          <NavLink to="/dashboard/admin/coupons">Manage Coupons</NavLink>
          <NavLink to="/dashboard/admin/announcements">Announcements</NavLink>
        </>
      );
    } else if (role === "member") {
      return (
        <>
         <NavLink to="/" className="mx-2">Home</NavLink>
          <NavLink to="/dashboard/member/profile">My Profile</NavLink>
          <NavLink to="/dashboard/member/pending">Pending Bookings</NavLink>
          <NavLink to="/dashboard/member/approved">Approved Bookings</NavLink>
          <NavLink to="/dashboard/member/confirmed">Confirmed Bookings</NavLink>
          <NavLink to="/dashboard/member/history">Payment History</NavLink>
          <NavLink to="/dashboard/member/announcements">Announcements</NavLink>
        </>
      );
    } else {
      return (
        <>
         <NavLink to="/" className="mx-2">Home</NavLink>
          <NavLink to="/dashboard/user/profile">My Profile</NavLink>
          <NavLink to="/dashboard/user/pending">Pending Bookings</NavLink>
          <NavLink to="/dashboard/user/bookings">Bookings</NavLink>
          <NavLink to="/dashboard/user/announcements">Announcements</NavLink>
        </>
      );
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 p-5 space-y-3 text-white bg-slate-800">
        <h2 className="mb-4 text-2xl font-bold">Dashboard</h2>
        <div className="flex flex-col space-y-2 [&>a]:text-white [&>a]:hover:underline">
          {renderSidebarLinks()}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1 mt-6 text-white bg-red-600 rounded hover:bg-red-700"
        >
          <FiLogOut />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
