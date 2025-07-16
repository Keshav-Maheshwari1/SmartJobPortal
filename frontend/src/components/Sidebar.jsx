import React, { useState } from "react";
import { logOutUser } from "../services/authApi";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeSection, setActiveSection, sections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOutUser();
    navigate("/login", { replace: true }); // replaces history entry
    window.location.reload();
  };

  return (
    <aside
      className="w-full  md:w-64 bg-transparent md:bg-gray-800/70 md:backdrop-blur-md
     text-white h-full px-6 py-8 shadow-lg rounded-3xl relative md:top-24 md:left-24"
    >
      <button
        className="md:hidden flex items-center mb-6 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-7 h-7 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <span className="font-bold text-lg">Menu</span>
      </button>

      <div className={`${isOpen ? "block" : "hidden"} md:block transition-all`}>
        <ul className="space-y-5">
          {sections.map((section) => (
            <li key={section.name}>
              <button
                onClick={() => setActiveSection(section.name)}
                className={`flex items-center w-full px-4 py-3 rounded-xl text-left transition-all
                   duration-300 ease-in-out font-medium text-sm tracking-wide ${
                     activeSection === section.name
                       ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg scale-[1.02]"
                       : "hover:bg-gray-700"
                   }`}
              >
                <svg
                  className="w-5 h-5 mr-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={section.icon} />
                </svg>
                <span>{section.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-xl cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold 
            text-sm shadow-md transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
