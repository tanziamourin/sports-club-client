import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-16 h-8 p-1 transition-all duration-300 bg-gray-200 rounded-full dark:bg-gray-700"
    >
      {/* Sun */}
      <SunIcon
        className={`w-5 h-5 text-yellow-400 transition-transform duration-300 ${
          isDark ? "opacity-0 scale-0" : "opacity-100 scale-100"
        }`}
      />

      {/* Moon */}
      <MoonIcon
        className={`w-5 h-5 text-blue-500 transition-transform duration-300 ${
          isDark ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      />

      {/* Sliding circle */}
      <span
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isDark ? "translate-x-8" : "translate-x-0"
        }`}
      ></span>
    </button>
  );
};

export default ThemeToggle;
