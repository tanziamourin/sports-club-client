import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--color-background)] px-4">
      <div className="w-full max-w-md p-6 text-center bg-white border border-orange-200 shadow-lg rounded-xl">
        <img
          src={user?.photoURL || "https://i.ibb.co/ck1SGFJ/profile-placeholder.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full mx-auto border-4 border-[var(--color-primary)] mb-4"
        />
        <h2 className="text-2xl font-bold text-[var(--color-text-primarys)] mb-2">My Profile</h2>

        <div className="mt-4 space-y-2 text-left text-[var(--color-text-primarys)]">
          <p><span className="font-semibold">👤 Name:</span> {user?.displayName || "N/A"}</p>
          <p><span className="font-semibold">📧 Email:</span> {user?.email}</p>
          <p>
            <span className="font-semibold">📅 Joined:</span>{" "}
            {user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
