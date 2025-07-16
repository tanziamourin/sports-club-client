// src/components/Logo.jsx
import { Link } from "react-router-dom";

const Logo = ({ showText = true, link = true }) => {
  const logoContent = (
    <div className="flex items-center gap-2">
      {showText && (
        <h2 className="flex items-center gap-2 text-3xl font-extrabold ">
          🏸 <span className="text-black">Sports </span>
          <span className="text-[var(--color-accent)]"> Club</span>
        </h2>
      )}
    </div>
  );

  return link ? <Link to="/">{logoContent}</Link> : logoContent;
};

export default Logo;
