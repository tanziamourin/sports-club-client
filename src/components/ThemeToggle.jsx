import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"; // optional: Heroicons

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
      className="flex items-center gap-2 rounded-full btn btn-sm btn-outline"
    >
      {isDark ? (
        <>
          <SunIcon className="w-4 h-4 text-yellow-400" />
          
        </>
      ) : (
        <>
          <MoonIcon className="w-4 h-4 text-gray-800" />
          
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
