import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import TopNavbar from "./TopNavbar.jsx";
import LeftDateColoumn from "./LeftDateColoumn.jsx";
import MainTimeline from "./MainTimeLine.jsx";
import Calendar from "../Calendar.jsx"; 
import WorkPage from "../WorkPage.jsx";
import Settings from "../Settings";
import Tracker from "../Tracker/tracker.jsx";
import api from "../../utils/api";

function HomePageLayout({ darkMode, setDarkMode }) {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("home");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events');
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const showDateCol =
    (location.pathname === "/" || location.pathname === "/calendar");

  const bgClass = darkMode ? "bg-black text-white" : "bg-white text-black";
  const isHomepage = location.pathname === "/";

  // Calculate sidebar width for homepage margin
  const sidebarWidth = sidebarOpen ? "118px" : "70px";

  return (
    <div className={`flex min-h-screen w-full transition-colors duration-300 ${bgClass}`}>
      {/* Sidebar */}
      <Sidebar 
        darkMode={darkMode} 
        activeItem={activeItem} 
        onNavClick={setActiveItem}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main content container - adjusted for fixed sidebar on homepage */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden
          ${isHomepage ? "transition-all duration-500 ease-in-out" : ""}
          ${isHomepage ? (sidebarOpen ? "ml-[118px]" : "ml-[70px]") : ""}`}
      >
        <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} events={events} refreshEvents={refreshEvents} />

        <main className="flex flex-row w-full min-h-full">
          {/* Left date column (optional) */}
          {showDateCol && (
            <div className="w-auto">
              <LeftDateColoumn darkMode={darkMode} events={events} setEvents={setEvents} />
            </div>
          )}

          {/* Main Content Routing */}
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<MainTimeline darkMode={darkMode} events={events} setEvents={setEvents} />} />
              <Route path="/calendar" element={<Calendar darkMode={darkMode} />} />
              <Route path="/work" element={<WorkPage darkMode={darkMode} />} />
              <Route path="/tracker" element={<Tracker darkMode={darkMode} />} />
              <Route path="/settings" element={<Settings darkMode={darkMode} />} />
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center w-full h-full text-3xl font-bold animate-fade-in">
                    {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)} Page Coming Soon
                  </div>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePageLayout;