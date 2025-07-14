import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
// import { AuthContext } from "../../contexts/AuthContext";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-2">
      <h2 className="mb-4 text-2xl font-bold">My Profile</h2>
      <p><strong>Name:</strong> {user?.displayName || "N/A"}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Joined:</strong> {user?.metadata?.creationTime}</p>
    </div>
  );
};

export default UserProfile;
