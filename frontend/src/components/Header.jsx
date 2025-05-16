import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchUser } from "../customHooks/useAuth";
import { logo } from "../assets";
import { FaBars, FaTimes } from "react-icons/fa";
import AnimatedSection from "./AnimatedSection";

const Header = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email || "");
  }, []);

  const { data, isLoading } = useFetchUser(userEmail);
  const isHR = data?.role === "HR";
  const userName = data?.name.split(" ")[0];
  const name =
    userName?.charAt(0).toUpperCase() + userName?.slice(1).toLowerCase();

  const profilePath = isHR ? "/profile/hr" : "/profile/applicant";
  const isLoggedIn = Boolean(userEmail && data);

  const handleProfileClick = () => {
    navigate(profilePath);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Scroll lock when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <header className="bg-gray-900 text-white shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </Link>

        {/* Nav links (desktop) */}
        <nav className="hidden md:flex items-center space-x-8">
          {["/", "/jobs", "/contact"].map((path, i) => {
            const label = ["Home", "Jobs", "Contact"][i];
            return (
              <Link
                key={label}
                to={path}
                className="text-lg font-medium text-[#2865FC] hover:text-blue-400 transition duration-300"
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <span
              onClick={handleProfileClick}
              className="cursor-pointer bg-gray-800 py-2 px-4 rounded-full hover:text-blue-400 transition"
            >
              {name}
            </span>
          ) : (
            <Link to="/login">
              <button className="py-2 px-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Hamburger */}
        <div className="md:hidden ">
          <button
            onClick={toggleMenu}
            className="text-white bg-transparent focus:outline-none"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatedSection
        className={`md:hidden bg-gray-800 overflow-hidden ${
          menuOpen ? "min-h-screen py-6" : "max-h-0 py-0"
        }`}
      >
        <div className="flex flex-col items-center space-y-4 px-4">
          {["/", "/jobs", "/contact"].map((path, i) => {
            const label = ["Home", "Jobs", "Contact"][i];
            return (
              <Link
                key={label}
                to={path}
                onClick={toggleMenu}
                className="text-lg font-semibold text-[#2865FC] hover:text-blue-400 transition"
              >
                {label}
              </Link>
            );
          })}

          {isLoggedIn ? (
            <span
              onClick={handleProfileClick}
              className="cursor-pointer text-white hover:text-blue-400 transition"
            >
              {name}
            </span>
          ) : (
            <Link to="/login">
              <button
                onClick={toggleMenu}
                className="py-2 px-6 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
            </Link>
          )}
        </div>
      </AnimatedSection>
    </header>
  );
};

export default Header;
