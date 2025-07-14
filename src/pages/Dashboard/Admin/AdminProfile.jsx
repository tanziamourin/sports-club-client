import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: stats = {} } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded shadow">
        <img src={user?.photoURL} alt="Admin" className="w-20 h-20 mb-2 rounded-full" />
        <h2 className="text-xl font-semibold">{user?.displayName}</h2>
        <p>{user?.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-blue-100 rounded">Total Courts: {stats.totalCourts}</div>
        <div className="p-4 bg-green-100 rounded">Total Users: {stats.totalUsers}</div>
        <div className="p-4 bg-yellow-100 rounded">Total Members: {stats.totalMembers}</div>
      </div>
    </div>
  );
};

export default AdminProfile;
