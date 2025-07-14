import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const handleLogout = () => {
    logOut().then().catch();
  };

  const navLinks = (
    <>
      <NavLink to="/" className="mx-2">Home</NavLink>
      <NavLink to="/courts" className="mx-2">Courts</NavLink>
      {user ? (
        <NavLink to="/dashboard" className="mx-2">Dashboard</NavLink>
      ) : (
        <NavLink to="/login" className="mx-2">Login</NavLink>
      )}
    </>
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 shadow-md">
      <Link to="/" className="text-xl font-bold text-blue-600">🏀 Sports Club</Link>
      <div className="space-x-4">{navLinks}</div>
      {user && (
        <div className="relative group">
          <img
            src={user.photoURL || "/default-avatar.png"}
            className="w-8 h-8 rounded-full cursor-pointer"
            alt="profile"
          />
          <div className="absolute right-0 hidden p-2 mt-2 bg-white rounded shadow-md group-hover:block">
            <p className="text-sm">{user.displayName || user.email}</p>
            <Link to="/dashboard" className="text-blue-500 ">Dashboard</Link>
            <button onClick={handleLogout} className="text-red-500">Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
