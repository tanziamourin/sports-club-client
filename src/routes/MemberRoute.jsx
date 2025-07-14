// routes/MemberRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MemberRoute = ({ children }) => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;
  return user && role === "member" ? children : <Navigate to="/login" replace />;
};

export default MemberRoute;
