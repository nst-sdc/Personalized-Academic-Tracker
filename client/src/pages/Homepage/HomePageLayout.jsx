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
  // Shared events state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchEvents();
}, []);

  const showDateCol =
    (location.pathname === "/" || location.pathname === "/calendar");

  const bgClass = darkMode ? "bg-black text-white" : "bg-white text-black";

  return (
    <div className={`flex h-screen w-full transition-colors duration-300 ${bgClass}`}>
      <Sidebar darkMode={darkMode} activeItem={activeItem} onNavClick={setActiveItem} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex flex-row w-full h-[calc(100vh-118px)]">
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
              <Route path="/work" element={<WorkPage />} />
              <Route path="/tracker" element={<Tracker />} />
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
