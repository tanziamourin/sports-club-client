// src/components/Logo.jsx
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"
const Logo = ({ showText = true, link = true }) => {
  const logoContent = (
    <div className="">
      {/* {showText && (
        <h2 className="flex items-center gap-2 text-3xl font-extrabold ">
          🏸 <span className="text-black">Sports </span>
          <span className="text-[var(--color-accent)]"> Club</span>
        </h2>
      )} */}
      <img className="w-20 h-20 " src ={logo} alt="" />

    </div>
  );

  return link ? <Link to="/">{logoContent}</Link> : logoContent;
};

export default Logo;
