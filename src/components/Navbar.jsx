import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout().then().catch();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition-all duration-200 
     ${isActive ? "btn-primary" : ""}`;

  const navLinks = (
    <>
      <NavLink to="/" className={navLinkClass}>
        Home
      </NavLink>
      <NavLink to="/courts" className={navLinkClass}>
        Courts
      </NavLink>
      {!user && (
        <NavLink to="/login" className={navLinkClass}>
          Login
        </NavLink>
      )}
      <ThemeToggle></ThemeToggle>
    </>
  );

  return (
    <header className="border-b shadow ">
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl">
        {/* Logo */}
        <Logo></Logo>

        {/* Desktop Nav */}
        <nav className="items-center hidden gap-6 md:flex">
          {navLinks}

          {/* Profile Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2"
              >
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="user"
                  className="object-cover border-2 rounded-full w-9 h-9 border-primary"
                />
                <FiChevronDown className="text-gray-500" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 z-50 w-48 p-4 mt-2 space-y-2 bg-white rounded-md shadow-lg text-textPrimary">
                  <p className="text-sm font-semibold">
                    {user.displayName || user.email}
                  </p>
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block text-primary hover:underline"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="text-2xl md:hidden text-primary"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="px-4 py-4 space-y-2 bg-white border-t border-gray-200 md:hidden">
          {navLinks}
          {user && (
            <div className="pt-4 mt-4 space-y-1 border-t">
              <p className="text-sm text-textSecondary">
                {user.displayName || user.email}
              </p>
              <Link
                to="/dashboard"
                onClick={toggleMobileMenu}
                className="block text-primary hover:underline"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
