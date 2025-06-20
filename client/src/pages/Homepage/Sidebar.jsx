import React from "react";
import { AiFillHome, AiOutlineCalendar, AiFillPieChart, AiOutlineSetting } from "react-icons/ai";
import { MdWork, MdPlayArrow, MdLogout } from "react-icons/md";
import { SiAirtable } from "react-icons/si"; // Example logo substitute

const navItems = [
  { key: "home", icon: <AiFillHome size={28} />, alt: "Home" },
  { key: "calendar", icon: <AiOutlineCalendar size={28} />, alt: "Calendar" },
  { key: "work", icon: <MdWork size={28} />, alt: "Work" },
  { key: "play", icon: <MdPlayArrow size={28} />, alt: "Play" },
  { key: "chart", icon: <AiFillPieChart size={28} />, alt: "Chart" },
  { key: "settings", icon: <AiOutlineSetting size={28} />, alt: "Settings" },
];

const Sidebar = ({ darkMode, activeItem, onNavClick }) => {
  const bgColor = darkMode ? "bg-[#0D0D0D]" : "bg-white";

  return (
    <aside className={`w-[118px] h-screen flex justify-center overflow-hidden transition-colors duration-300 ${bgColor}`}>
      <div className="flex flex-col items-center justify-between h-full py-7">
        {/* Logo Substitute */}
        <div>
          <SiAirtable size={48} className="text-[#4361ee]" />
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col items-center gap-8 mt-24">
          {navItems.map((item) => (
            <div
              key={item.key}
              className={`relative w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors duration-200 ${
                activeItem === item.key ? "bg-[#e0e0e0]" : ""
              }`}
              onClick={() => onNavClick && onNavClick(item.key)}
              title={item.alt}
            >
              <div className={`transition duration-200 ${activeItem === item.key ? "text-[#4361ee]" : "text-gray-500"}`}>
                {item.icon}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout Icon */}
        <div className="mb-7 cursor-pointer text-gray-600 hover:text-red-600">
          <MdLogout size={28} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;