import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  AiFillHome,
  AiOutlineCalendar,
  AiFillPieChart,
  AiOutlineSetting,
} from "react-icons/ai";
import { MdWork, MdPlayArrow, MdLogout, MdTrackChanges } from "react-icons/md";
import { SiAirtable } from "react-icons/si";

const navItems = [
  { key: "home", icon: <AiFillHome size={24} />, alt: "Home", path: "/" },
  { key: "calendar", icon: <AiOutlineCalendar size={24} />, alt: "Calendar", path: "/calendar" },
  { key: "tracker", icon: <MdTrackChanges size={24} />, alt: "Tracker", path: "/tracker" },
  { key: "settings", icon: <AiOutlineSetting size={24} />, alt: "Settings", path: "/settings" },
];

const Sidebar = ({ darkMode, open, setOpen }) => {
  const location = useLocation();
  // Use props if provided, otherwise use internal state
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = open !== undefined ? open : internalOpen;
  const toggleOpen = setOpen || setInternalOpen;
  const bgColor = darkMode ? "bg-[#0D0D0D]" : "bg-white";
  const isHomepage = location.pathname === "/";
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('tokenExpiry');
    // setUser(null);
    // setShowDropdown(false);
    navigate('/signin');
  };

  return (
    <aside
      className={`h-screen flex justify-center overflow-hidden transition-all duration-500 ease-in-out border-r shadow-lg z-50
        ${bgColor} ${darkMode ? "border-gray-800" : "border-gray-100"}
        ${isOpen ? "w-[118px]" : "w-[70px]"}
        ${isHomepage ? "fixed left-0 top-0" : "relative"}`}
    >
      <div className={`flex flex-col items-center justify-between h-full py-7 w-full transition-all duration-500 ${isOpen ? "" : "py-0"}`}>
        {/* Logo (clickable) */}
        <div
          className="relative group cursor-pointer flex flex-col items-center justify-center"
          style={{ minHeight: isOpen ? 0 : "100vh" }}
          onClick={() => toggleOpen((prev) => !prev)}
          title="Toggle sidebar"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-r from-[#4361ee] to-[#7209b7] p-2 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:rotate-3">
            <SiAirtable size={36} className="text-white drop-shadow-sm" />
          </div>
        </div>

        {/* Navigation and Logout (hide if closed) */}
        {isOpen && (
          <>
            {/* Navigation */}
            <nav className="flex flex-col items-center gap-6 mt-16">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    title={item.alt}
                    className={`relative w-14 h-14 flex items-center justify-center rounded-xl z-10
                      transition-all duration-300 ease-in-out group overflow-hidden
                      ${isActive
                        ? `${darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"} scale-110 shadow-md`
                        : `${darkMode ? "text-gray-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-600"} hover:scale-105 ${
                            darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                          }`
                      }`}
                  >
                    {/* Left Active Indicator */}
                    {isActive && (
                      <>
                        <span className="absolute left-0 h-10 w-1 bg-gradient-to-b from-blue-500 to-blue-700 rounded-r-lg shadow-md shadow-blue-400/30"></span>
                        <span className="absolute -left-2 h-10 w-4 bg-blue-400 opacity-20 blur-lg rounded-r-full"></span>
                      </>
                    )}

                    {/* Icon */}
                    <span className="relative z-10">{item.icon}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="relative group">
              <button
                title="Logout"
                onClick={handleLogout}
                className={`w-14 h-14 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden
                  transition-all duration-300 ease-out
                  ${darkMode ? "text-gray-400 hover:text-red-400 hover:bg-red-900/20" : "text-gray-500 hover:text-red-600 hover:bg-red-50"}
                  hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`}
              >
                <MdLogout size={24} className="relative z-10" />
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;