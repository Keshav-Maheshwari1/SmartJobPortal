import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchUser } from "../customHooks/useAuth";
import { logo } from "../assets";
import { FaBars, FaTimes } from "react-icons/fa";
import AnimatedSection from "./AnimatedSection";
import Slider from "react-slick";
import sliderImages from "../constants/sliderImages";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const userEmail = localStorage.getItem("userEmail");
  const { data, isLoading } = useFetchUser(userEmail);

  const isHR = data?.role === "HR";

  const userName = data?.name ? data.name.split(" ")[0] : "";
  const name = userName
    ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()
    : "";

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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    arrows: false,
    pauseOnHover: false,
    lazyLoad: "progressive",
  };

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <header className="bg-gray-900 text-white shadow-md  w-full z-50">
      <div className="container mx-auto flex justify-between md:justify-evenly items-center px-4 ">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
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
              <button className="py-2 px-4 bg-blue-600 cursor-pointer rounded-lg hover:bg-blue-700 transition">
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
        className={`md:hidden flex flex-col justify-around bg-gray-800 transition-all duration-500 ease-in-out overflow-hidden ${
          menuOpen ? "min-h-screen py-6" : "max-h-0 py-0"
        }`}
      >
        {/* Navigation Links */}
        <div className="flex flex-col items-center justify-start space-y-5 px-6">
          {["/", "/jobs", "/contact"].map((path, i) => {
            const label = ["Home", "Jobs", "Contact"][i];
            return (
              <Link
                key={label}
                to={path}
                onClick={toggleMenu}
                className="text-lg font-semibold text-blue-400 hover:text-white transition"
              >
                {label}
              </Link>
            );
          })}

          {isLoggedIn ? (
            <span
              onClick={handleProfileClick}
              className="cursor-pointer text-white font-medium hover:text-blue-400 transition"
            >
              {name}
            </span>
          ) : (
            <Link to="/login">
              <button
                onClick={toggleMenu}
                className="py-2 px-6 cursor-pointer bg-blue-600 rounded-lg hover:bg-blue-700 transition text-white font-medium"
              >
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Slider Section with Responsive Spacing */}
        <div className="w-full max-w-4xl mx-auto px-4 pt-6 sm:pt-8">
          <Slider {...sliderSettings}>
            {sliderImages.map((image, index) => (
              <div key={index} className="px-2">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-68 object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            ))}
          </Slider>
        </div>
      </AnimatedSection>
    </header>
  );
};

export default Header;
