import React from "react";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function TopNavbar({ darkMode, setDarkMode }) {
  const bgHeader = darkMode ? "bg-[#1A1A1A]" : "bg-[#F5F5F5]";
  const bgSearch = darkMode ? "bg-[#2A2A2A]" : "bg-[#F5F5F5]";
  const textColor = darkMode ? "text-white" : "text-black";
  const placeholderColor = darkMode ? "placeholder:text-gray-400" : "placeholder:text-gray-500";
  const pendingColor = darkMode ? "text-gray-300" : "text-gray-600";
  const profileTextColor = darkMode ? "text-gray-200" : "text-gray-800";
  const navigate = useNavigate();

  return (
    <header className={`relative h-[118px] px-6 w-full flex items-center justify-between transition-colors duration-300 ${bgHeader}`}>
      <div className={`flex items-center gap-3 px-4 py-2 rounded transition-colors duration-300 ${bgSearch}`}>
        <FiSearch alt="search icon" className="w-6 h-6" />
        <input
          type="text"
          placeholder="Search"
          className={`bg-transparent outline-none text-sm w-full ${textColor} ${placeholderColor}`}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(prev => !prev)}
          aria-label={darkMode ? "Activate Light Mode" : "Activate Dark Mode"}
          className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md border transition duration-300
            ${darkMode ? "bg-gray-800 text-yellow-300 border-gray-700 hover:bg-gray-700" 
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-200"}
          `}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "🌙" : "☀️"}
        </button>

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/signin")}>
          <FaUserCircle alt="profile" className="w-8 h-8 rounded-full object-cover" />
          <span className={`text-sm font-medium leading-none ${profileTextColor}`}>
            Username
          </span>
          <IoIosArrowDown alt="arrow" className="w-3 h-3 mt-[1px]" />
        </div>
      </div>

      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-sm ${pendingColor}`}>
        <div className="relative flex items-center">
          <IoMdNotificationsOutline alt="Notification" className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </div>
        <span className="leading-none">2 pending invites</span>
        <IoIosArrowDown alt="arrow" className="w-3 h-3 mt-[1px]" />
      </div>
    </header>
  );
}

export default TopNavbar;