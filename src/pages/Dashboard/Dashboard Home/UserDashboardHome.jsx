import UserDashboard from "../../../layouts/UserDashboard";

// pages/Dashboard/User/UserDashboardHome.jsx
const UserDashboardHome = () => {
  return (
    <div className="mt-10 text-center">
      <h1 className="mb-4 text-3xl font-bold">Welcome to Your Dashboard</h1>
      <p className="text-gray-600">Here you can manage your bookings, view announcements, and update your profile.</p>
      {/* <UserDashboard></UserDashboard> */}
    </div>
  );
};

export default UserDashboardHome;
