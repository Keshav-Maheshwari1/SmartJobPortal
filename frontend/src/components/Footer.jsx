import React from "react";
import { Link } from "react-router-dom";
import { logo } from "../assets";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 pt-16 pb-10 md:px-20 ">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-white">Smart Hire</h3>
          <p className="text-gray-400 mb-4">
            Connecting talent with opportunities.
          </p>
          <img src={logo} alt="Logo" className="h-24 w-auto" />
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-white">Navigation</h4>
          <ul className="space-y-3 text-gray-400">
            {[
              { label: "Home", to: "/" },
              { label: "Jobs", to: "/jobs" },
              { label: "Contact", to: "/contact" },
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms of Service", to: "/terms" },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="hover:text-blue-400 transition duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-white">Newsletter</h4>
          <p className="text-gray-400 mb-4">
            Stay updated with our latest job postings and insights.
          </p>
          <form className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <button className="w-full sm:w-auto px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-white font-medium">
              Subscribe
            </button>
          </form>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-white">Follow Us</h4>
          <div className="flex space-x-4 text-white">
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter className="w-6 h-6 hover:text-blue-400 transition" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin className="w-6 h-6 hover:text-blue-400 transition" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <FaGithub className="w-6 h-6 hover:text-blue-400 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Smart Job Portal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
