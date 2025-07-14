// src/components/Logo.jsx
import { Link } from 'react-router-dom';

const Logo = ({ size = 'text-2xl', showText = true, link = true }) => {
  const logoContent = (
    <div className="flex items-center gap-2">
      <img
        src="/logo.png"
        alt="Sports Club Logo"
        className="object-cover w-10 h-10 border border-gray-300 rounded-full"
      />
      {showText && (
        <span className={`${size} font-bold text-blue-600 tracking-wide`}>
          Sports Club
        </span>
      )}
    </div>
  );

  return link ? <Link to="/">{logoContent}</Link> : logoContent;
};

export default Logo;