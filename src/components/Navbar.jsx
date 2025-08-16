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

  // Active NavLink style with animation
  const navLinkClass = ({ isActive }) =>
    `relative px-4 py-2 rounded-md font-medium transition-all duration-300 
     ${isActive ? "text-primary  btn-primary " : "hover:text-primary"}`;

  const navLinks = (
    <>
      <NavLink
        to="/"
        className={navLinkClass}
        onClick={() => setMobileMenuOpen(false)}
      >
        Home
      </NavLink>
      <NavLink
        to="/courts"
        className={navLinkClass}
        onClick={() => setMobileMenuOpen(false)}
      >
        Courts
      </NavLink>
      {!user && (
        <NavLink
          to="/login"
          className={navLinkClass}
          onClick={() => setMobileMenuOpen(false)}
        >
          Login
        </NavLink>
      )}
      <ThemeToggle />
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 shadow-md dark:bg-gray-900 dark:border-gray-700">
      <div className="mx-auto  max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

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
                  <FiChevronDown className="text-gray-500 dark:text-gray-300" />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 z-50 w-48 p-4 mt-2 space-y-2 bg-white rounded-md shadow-lg dark:bg-gray-800"
                    >
                      <p className="text-sm font-semibold dark:text-white">
                        {user.displayName || user.email}
                      </p>
                      <Link
                        to="/dashboard"
                        onClick={() => {
                          toggleDropdown();
                          setMobileMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm font-medium rounded-md btn-primary"
                      >
                        Dashboard
                      </Link>
                      <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          <FiLogOut /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
      </div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-64 p-6 overflow-y-auto shadow-lg bg-amber-100 dark:bg-gray-900 md:hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <Logo />
              <button onClick={toggleMobileMenu} className="text-2xl">
                <FiX />
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              {navLinks}

              {user && (
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center w-full gap-2 px-4 py-3 rounded-md hover:bg-secondary/20"
                  >
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt="user"
                      className="object-cover border-2 rounded-full w-9 h-9 border-primary"
                    />
                    <span className="font-medium">
                      {user.displayName || user.email}
                    </span>
                    <FiChevronDown />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="pl-4 mt-2 space-y-2"
                      >
                        <Link
                          to="/dashboard"
                          onClick={() => {
                            toggleDropdown();
                            setMobileMenuOpen(false);
                          }}
                          className="block px-4 py-2 text-sm font-medium rounded-md btn-primary"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          <FiLogOut /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
