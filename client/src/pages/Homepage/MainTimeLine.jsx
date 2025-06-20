import React from "react";
import EventCard from "./EventCard";
import MainLogo from "../../assets/images/MainLogo.png";
import li_home from "../../assets/images/li_home.png";
import li_search from "../../assets/images/li_search.png";
import li_pie_chart from "../../assets/images/li_pie_chart.png";
import li_clock from "../../assets/images/li_clock.png";
import li_user from "../../assets/images/li_user.png";
import Arrow from "../../assets/images/Arrow.png";
import small from "../../assets/images/Rectangle 15.png";
import mid from "../../assets/images/Rectangle 11.png";
import large from "../../assets/images/Rectangle 13.png";
import Ellipse17 from "../../assets/images/Ellipse 17.png";

// Timeline starts at 11:00
const timelineStartHour = 11;
const pixelsPerMinute = 2.5;

// Converts time string like "13:15" to position in pixels
function calculateTopFromTime(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const totalMinutes = (hours - timelineStartHour) * 60 + minutes;
  return totalMinutes * pixelsPerMinute;
}

// Time labels
const times = ["11:00", "12:00", "13:00", "14:00", "15:00"];

// Events to be displayed
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
        
        {/* Left: Logo */}
        <div className="flex items-center space-x-2 relative">
          <div className="text-2xl font-bold tracking-tight">
            <img src={MainLogo} alt="LOGO" className="h-8 w-auto" />
          </div>
        </div>

        {/* Center: Navigation icons */}
        <div className={`flex items-center space-x-10 text-sm font-medium ${darkMode ? "text-gray-400" : "text-[#757575]"}`}>
          {[
            { icon: li_home, label: "Home", bg: "#E3F2FD" },
            { icon: li_search, label: "Search" },
            { icon: li_pie_chart, label: "Analysis" },
            { icon: li_clock, label: "History" },
            { icon: li_user, label: "Profile" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center cursor-pointer" aria-label={`Navigate to ${item.label}`}>
              <div
                className={`h-9 w-9 flex items-center justify-center mb-1 rounded-full`}
                style={{ backgroundColor: item.bg || "transparent" }}
              >
                <img src={item.icon} alt={`${item.label}_icon`} />
              </div>
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Right: Profile avatar */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
            <img src={Ellipse17} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <img src={Arrow} alt="arrow_icon" />
        </div>
      </nav>

      {/* Timeline area */}
      <main
        className={`relative pr-8 overflow-hidden ${darkMode ? "bg-black" : "bg-white"}`}
        style={{
          height: `${100 + calculateTopFromTime(events[events.length - 1].end) + events[events.length - 1].height + 16}px`,
        }}
      >
        {/* Header: Date */}
        <div className="flex items-baseline pl-8 pt-6 pb-6">
          <p className={`text-[32px] leading-none tracking-tight font-normal ${darkMode ? "text-gray-400" : "text-[#9E9E9E]"}`}>
            10th,
          </p>
          <p className={`font-khula font-semibold text-[38px] ml-2 leading-none tracking-tight ${darkMode ? "text-white" : "text-black"}`}>
            Monday
          </p>
        </div>

        {/* Time Labels Left */}
        <div className={`absolute left-0 top-[100px] w-[90px] text-right text-sm font-medium z-10 ${darkMode ? "text-gray-400" : "text-[#757575]"}`}>
          {times.map((time, index) => (
            <div
              key={time}
              className="flex flex-col items-end justify-start"
              style={{ height: `${60 * pixelsPerMinute}px` }}
            >
              <p className="mb-1">{time}</p>
              {/* Small dashes between time markers */}
              {index !== times.length - 1 && (
                <div className="flex flex-col justify-evenly h-full mt-2 pr-[4px]">
                  <img src={small} alt="small dash" className="w-[8px] h-[2px] opacity-50" />
                  <img src={mid} alt="mid dash" />
                  <img src={small} alt="small dash" className="w-[8px] h-[2px] opacity-50" />
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
          <img src={large} alt="large dash" />
          <div className="bg-[#00BCD4] mr-3" />
          <p className={`text-[28px] font-bold ${darkMode ? "text-white" : "text-black"}`}>12:45</p>
          <div className="ml-3">
            <p className="text-[12px] text-[#E91E63] leading-tight">Next event in</p>
            <p className="text-[12px] text-[#E91E63] leading-tight">30m</p>
          </div>
        </div>

        {/* Render Event Cards */}
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
