import React from "react";
import EventCard from "./EventCard";
import { MdHome, MdSearch, MdPieChart, MdAccessTime, MdPerson } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaCircle, FaMinus } from "react-icons/fa";

// Timeline starts at 11:00
const timelineStartHour = 11;
const pixelsPerMinute = 2.5;

function calculateTopFromTime(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const totalMinutes = (hours - timelineStartHour) * 60 + minutes;
  return totalMinutes * pixelsPerMinute;
}

const times = ["11:00", "12:00", "13:00", "14:00", "15:00"];

const events = [
  {
    title: "Ergonomics",
    start: "11:00",
    end: "12:00",
    duration: "1h",
    height: 152,
    bg: "bg-[#FFF4E6]",
    border: "border-[#FFB26B]",
    textColor: "text-[#FB8C00]",
    avatars: 2,
  },
  {
    title: "Tales of Women in Design",
    start: "13:15",
    end: "15:00",
    duration: "1h 45m",
    height: 194,
    bg: "bg-[#FFE6EB]",
    border: "border-[#FF829E]",
    textColor: "text-[#E91E63]",
    avatars: 3,
  },
];

const MainTimeLine = ({ darkMode }) => {
  return (
    <div className={`flex-1 flex flex-col ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      
      {/* Top navbar */}
      <nav className={`relative flex items-center justify-between h-[100px] px-8 flex-shrink-0 ${darkMode ? "bg-black" : "bg-white"}`}>
        
        {/* Left: Logo (you can still use your actual logo image here if needed) */}
        <div className="flex items-center space-x-2 relative">
          <div className="text-2xl font-bold tracking-tight">LOGO</div>
        </div>

        {/* Center: Navigation icons */}
        <div className={`flex items-center space-x-10 text-sm font-medium ${darkMode ? "text-gray-400" : "text-[#757575]"}`}>
          {[
            { icon: <MdHome size={24} />, label: "Home", bg: "#E3F2FD" },
            { icon: <MdSearch size={24} />, label: "Search" },
            { icon: <MdPieChart size={24} />, label: "Analysis" },
            { icon: <MdAccessTime size={24} />, label: "History" },
            { icon: <MdPerson size={24} />, label: "Profile" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center cursor-pointer" aria-label={`Navigate to ${item.label}`}>
              <div
                className="h-9 w-9 flex items-center justify-center mb-1 rounded-full"
                style={{ backgroundColor: item.bg || "transparent" }}
              >
                {item.icon}
              </div>
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Right: Profile avatar */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white shadow-sm flex items-center justify-center text-white font-semibold text-sm">
            U
          </div>
          <IoMdArrowDropdown size={20} />
        </div>
      </nav>

      {/* Timeline Area */}
      <main
        className={`relative pr-8 overflow-hidden ${darkMode ? "bg-black" : "bg-white"}`}
        style={{
          height: `${100 + calculateTopFromTime(events[events.length - 1].end) + events[events.length - 1].height + 16}px`,
        }}
      >
        {/* Header */}
        <div className="flex items-baseline pl-8 pt-6 pb-6">
          <p className={`text-[32px] font-normal ${darkMode ? "text-gray-400" : "text-[#9E9E9E]"}`}>
            10th,
          </p>
          <p className={`font-khula font-semibold text-[38px] ml-2 ${darkMode ? "text-white" : "text-black"}`}>
            Monday
          </p>
        </div>

        {/* Time Labels */}
        <div className={`absolute left-0 top-[100px] w-[90px] text-right text-sm font-medium z-10 ${darkMode ? "text-gray-400" : "text-[#757575]"}`}>
          {times.map((time, index) => (
            <div
              key={time}
              className="flex flex-col items-end justify-start"
              style={{ height: `${60 * pixelsPerMinute}px` }}
            >
              <p className="mb-1">{time}</p>
              {/* Replace small/mid dashes */}
              {index !== times.length - 1 && (
                <div className="flex flex-col justify-evenly h-full mt-2 pr-[4px] text-gray-400">
                  <FaMinus className="opacity-50 text-[6px]" />
                  <FaMinus className="text-[10px]" />
                  <FaMinus className="opacity-50 text-[6px]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current Time Marker */}
        <div
          className="absolute left-[60px] flex items-center z-10"
          style={{ top: `${100 + calculateTopFromTime("12:45")}px` }}
        >
          <FaMinus className="text-[#00BCD4] text-[12px]" />
          <div className="bg-[#00BCD4] w-1 h-1 rounded-full ml-2 mr-3" />
          <p className={`text-[28px] font-bold ${darkMode ? "text-white" : "text-black"}`}>12:45</p>
          <div className="ml-3">
            <p className="text-[12px] text-[#E91E63] leading-tight">Next event in</p>
            <p className="text-[12px] text-[#E91E63] leading-tight">30m</p>
          </div>
        </div>

        {/* Events */}
        {events.map((event, idx) => (
          <div
            key={idx}
            className="absolute left-[105px] z-10"
            style={{ top: `${100 + calculateTopFromTime(event.start)}px` }}
          >
            <EventCard
              title={event.title}
              start={event.start}
              end={event.end}
              duration={event.duration}
              bgColor={event.bg}
              borderColor={event.border}
              textColor={event.textColor}
              avatars={event.avatars}
              height={event.height}
            />
          </div>
        ))}

        {/* Add Event Button */}
        <button
          className="fixed bottom-8 right-8 bg-[#FF5722] text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 z-20"
          aria-label="Add new event"
        >
          <span className="text-2xl font-light leading-none">+</span>
          <span className="text-[15px] font-medium">Add Event</span>
        </button>
      </main>
    </div>
  );
};

export default MainTimeLine;