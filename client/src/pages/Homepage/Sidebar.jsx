import React from "react";
import { NavLink } from "react-router-dom";
import {
  AiFillHome,
  AiOutlineCalendar,
  AiFillPieChart,
  AiOutlineSetting,
} from "react-icons/ai";
import { MdWork, MdPlayArrow, MdLogout } from "react-icons/md";
import { SiAirtable } from "react-icons/si"; // Logo substitute

const navItems = [
  { key: "home", icon: <AiFillHome size={28} />, alt: "Home", path: "/" },
  { key: "calendar", icon: <AiOutlineCalendar size={28} />, alt: "Calendar", path: "/calendar" },
  { key: "work", icon: <MdWork size={28} />, alt: "Work", path: "/work" },
  { key: "play", icon: <MdPlayArrow size={28} />, alt: "Play", path: "/play" },
  { key: "chart", icon: <AiFillPieChart size={28} />, alt: "Chart", path: "/chart" },
  { key: "settings", icon: <AiOutlineSetting size={28} />, alt: "Settings", path: "/settings" },
];

const Sidebar = ({ darkMode }) => {
  const bgColor = darkMode ? "bg-[#0D0D0D]" : "bg-white";

  return (
    <aside className={`w-[118px] h-screen flex justify-center overflow-hidden transition-colors duration-300 ${bgColor}`}>
      <div className="flex flex-col items-center justify-between h-full py-7">

        {/* Logo */}
        <div>
          <SiAirtable size={48} className="text-[#4361ee]" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col items-center gap-8 mt-24">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              title={item.alt}
              className={({ isActive }) =>
                `relative w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors duration-200`
              }
            >
              {({ isActive }) => (
                <div className={`transition duration-200 ${isActive ? "text-red-600" : "text-gray-500"}`}>
                  {item.icon}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Icon */}
        <div className="mb-7 cursor-pointer text-gray-600 hover:text-red-600" title="Logout">
          <MdLogout size={28} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
