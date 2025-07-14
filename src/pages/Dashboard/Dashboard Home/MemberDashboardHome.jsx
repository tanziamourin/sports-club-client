import MemberDashboardLayout from "../../../layouts/MemberDashboardLayout";

// pages/Dashboard/Member/MemberDashboardHome.jsx
const MemberDashboardHome = () => {
  return (
    <div className="mt-10 text-center">
      <h1 className="mb-4 text-3xl font-bold">Welcome, Club Member!</h1>
      <p className="text-gray-600">You can view your approved bookings, make payments, and check announcements here.</p>

      {/* <MemberDashboardLayout></MemberDashboardLayout> */}
    </div>
  );
};

export default MemberDashboardHome;
