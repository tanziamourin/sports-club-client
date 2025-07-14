import { useContext } from "react";
// import { AuthContext } from "../../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MemberProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // 🔍 Get member info from DB (including join date)
  const { data: memberInfo = {} } = useQuery({
    queryKey: ["memberProfile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/members/${user.email}`);
      return res.data;
    },
  });

  return (
    <div className="max-w-md p-6 mx-auto space-y-4 bg-white rounded shadow">
      <div className="text-center">
        <img
          src={user?.photoURL || "https://i.ibb.co/ck1SGFJ/profile-placeholder.png"}
          alt="Profile"
          className="w-24 h-24 mx-auto border rounded-full"
        />
        <h2 className="mt-2 text-2xl font-bold">{user?.displayName}</h2>
        <p className="text-gray-600">{user?.email}</p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-lg">
          <strong>Member Since:</strong>{" "}
          <span className="font-semibold text-blue-600">
            {memberInfo?.memberSince
              ? new Date(memberInfo.memberSince).toLocaleDateString()
              : "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default MemberProfile;
