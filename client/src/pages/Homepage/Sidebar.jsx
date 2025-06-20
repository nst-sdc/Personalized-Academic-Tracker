import React from "react";
import logo from "../../assets/images/Logo.png";
import homeIcon from "../../assets/images/Home.png";
import calendarIcon from "../../assets/images/Group 40.png";
import workIcon from "../../assets/images/Work.png";
import playIcon from "../../assets/images/Play.png";
import chartIcon from "../../assets/images/Chart.png";
import settingsIcon from "../../assets/images/Setting.png";
import logoutIcon from "../../assets/images/Logout.png";

const Sidebar = ({ darkMode }) => {
  const bgColor = darkMode ? "bg-[#0D0D0D]" : "bg-white";

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
          <img src={homeIcon} alt="Home" className="w-8 h-8 cursor-pointer" loading="lazy" />
          <img src={calendarIcon} alt="Calendar" className="w-8 h-8 cursor-pointer" loading="lazy" />
          <img src={workIcon} alt="Work" className="w-8 h-8 cursor-pointer" loading="lazy" />
          <img src={playIcon} alt="Play" className="w-8 h-8 cursor-pointer" loading="lazy" />
          <img src={chartIcon} alt="Chart" className="w-8 h-8 cursor-pointer" loading="lazy" />
          <img src={settingsIcon} alt="Settings" className="w-8 h-8 cursor-pxointer" loading="lazy" />
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
