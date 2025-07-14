// src/components/Footer.jsx
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="px-4 pt-10 pb-6 md:px-10 " style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-background)' }}>
      <div className="grid grid-cols-1 gap-8 mx-auto max-w-7xl md:grid-cols-4">

        {/* Logo & About */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-3xl">
            🏸
            <h2 className="text-3xl font-extrabold ">Sports Club</h2>
          </div>
          <p className="text-sm text-[var(--color-background)]">
            Empowering athletes and enthusiasts through world-class facilities and a vibrant community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-white hover:underline ">Home</Link></li>
            <li><Link to="/courts" className="hover:underline ">Courts</Link></li>
            <li><Link to="/login" className="hover:underline ">Login</Link></li>
            <li><Link to="/dashboard" className=" hover:underline">Dashboard</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Contact Us</h3>
          <p className="text-sm text-[var(--color-background)]">📍 123 Club Avenue, Chattogram, Bangladesh</p>
          <p className="text-sm text-[var(--color-background)]">📞 +880 1234 567890</p>
          <p className="text-sm text-[var(--color-background)]">✉️ info@sportsclub.com</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white text-[var(--color-background)]"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white text-[var(--color-background)]"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white text-[var(--color-background)]"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white text-[var(--color-background)]"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t pt-4 text-center text-sm text-[var(--color-background)] border-[rgba(255,255,255,0.3)]">
        © {new Date().getFullYear()} Sports Club. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
