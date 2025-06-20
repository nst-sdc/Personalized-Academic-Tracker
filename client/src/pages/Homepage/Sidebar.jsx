import React from "react";
import logo from "../../assets/images/Logo.png";
import homeIcon from "../../assets/images/Home.png";
import calendarIcon from "../../assets/images/Group 40.png";
import workIcon from "../../assets/images/Work.png";
import playIcon from "../../assets/images/Play.png";
import chartIcon from "../../assets/images/Chart.png";
import settingsIcon from "../../assets/images/Setting.png";
import logoutIcon from "../../assets/images/Logout.png";

const navItems = [
  { key: "home", icon: homeIcon, alt: "Home" },
  { key: "calendar", icon: calendarIcon, alt: "Calendar" },
  { key: "work", icon: workIcon, alt: "Work" },
  { key: "play", icon: playIcon, alt: "Play" },
  { key: "chart", icon: chartIcon, alt: "Chart" },
  { key: "settings", icon: settingsIcon, alt: "Settings" },
];

const Sidebar = ({ darkMode, activeItem, onNavClick }) => {
  const bgColor = darkMode ? "bg-[#0D0D0D]" : "bg-white";
  const activeBg = darkMode ? "bg-[#232323]" : "bg-gray-200";

  return (
    <aside className={`w-[118px] h-screen flex justify-center overflow-hidden transition-colors duration-300 ${bgColor}`}>
      <div className="flex flex-col items-center justify-between h-full py-7">
        {/* Logo */}
        <div>
          <img
            src={logo}
            alt="Logo"
            className="w-[62px] h-[62px]"
            loading="lazy"
          />
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col items-center gap-8 mt-24">
          {navItems.map((item) => (
            <div
              key={item.key}
              className={`relative w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors duration-200`}
              onClick={() => onNavClick && onNavClick(item.key)}
              title={item.alt}
            >
              <img
                src={item.icon}
                alt={item.alt}
                className={`w-8 h-8 transition duration-200 ${activeItem === item.key ? 'sidebar-icon-red' : ''}`}
                loading="lazy"
              />
            </div>
          ))}
        </nav>

        {/* Logout Icon */}
        <div>
          <img
            src={logoutIcon}
            alt="Logout"
            className="w-8 h-8 mb-7 cursor-pointer"
            loading="lazy"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
