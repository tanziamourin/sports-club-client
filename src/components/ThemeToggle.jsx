import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center p-1 transition-all duration-300 bg-gray-200 rounded-full w-14 h-7 dark:bg-gray-700 hover:shadow-lg"
    >
      {/* Sliding toggle */}
      <div
        className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isDark ? "translate-x-7" : "translate-x-0"
        } flex items-center justify-center`}
      >
        {isDark ? (
          <SunIcon className="w-4 h-4 text-yellow-400" />
        ) : (
          <MoonIcon className="w-4 h-4 text-gray-800" />
        )}
      </div>

      {/* Optional icons background */}
      <div className="absolute text-gray-400 left-1 dark:text-yellow-400">
        <SunIcon className="w-3 h-3" />
      </div>
      <div className="absolute text-gray-400 right-1 dark:text-gray-200">
        <MoonIcon className="w-3 h-3" />
      </div>
    </button>
  );
};

export default ThemeToggle;
