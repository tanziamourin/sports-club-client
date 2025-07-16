import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX, FiLogOut, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
      <NavLink to="/" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/courts" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
        Courts
      </NavLink>
      <ThemeToggle />
      {!user && (
        <NavLink to="/login" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
          Login
        </NavLink>
      )}
    </>
  );

  return (
    <header className="border-b shadow">
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl">
        {/* Logo */}
        <Logo />

        {/* Desktop Nav */}
        <nav className="items-center hidden gap-6 md:flex">
          {navLinks}

          {/* Profile Dropdown */}
          {user && (
            <div className="relative text-[var(--color-background)]">
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
                    onClick={() => {
                      toggleDropdown();
                      setMobileMenuOpen(false);
                    }}
                    className="ml-5 w-[25] px-4 py-2 font-medium transition-all duration-200 rounded-md btn-primary hover:underline"
                  >
                    Dashboard
                  </Link>
                  <div className="p-6 border-t border-white/20">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
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

      {/* Mobile Menu with animation and backdrop blur */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -200, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-40 px-4 py-4 space-y-2 border-t border-gray-200 md:hidden backdrop-blur-md bg-[var(--color-secondary)]/90"
          >
            <div className="flex gap-x-3">{navLinks}</div>

            {user && (
              <div className="relative  text-[var(--color-background)]">
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
                  <div className="absolute left-0 z-50 w-48 p-4 mt-2 space-y-2 bg-white rounded-md shadow-lg text-textPrimary">
                    <p className="text-sm font-semibold">
                      {user.displayName || user.email}
                    </p>
                    <Link
                      to="/dashboard"
                      onClick={() => {
                        toggleDropdown();
                        setMobileMenuOpen(false);
                      }}
                      className="ml-5 w-[25] px-4 py-2 font-medium transition-all duration-200 rounded-md btn-primary hover:underline"
                    >
                      Dashboard
                    </Link>
                    <div className="p-6 border-t border-white/20">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
