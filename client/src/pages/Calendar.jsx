import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, Filter, Search, Download, Settings } from "lucide-react";

const Calendar = ({ darkMode }) => {
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const events = [
    {
      id: "1",
      title: "Assignment 1 Due",
      start: "2024-07-29T10:00:00",
      end: "2024-07-29T11:00:00",
      allDay: false,
      backgroundColor: "#ef4444",
      borderColor: "#ef4444",
      category: "academic",
      description: "Submit final assignment for Computer Science course",
      location: "Online Portal",
    },
    {
      id: "2",
      title: "Quiz - Data Structures",
      start: "2024-07-30T14:00:00",
      end: "2024-07-30T15:30:00",
      allDay: false,
      backgroundColor: "#f97316",
      borderColor: "#f97316",
      category: "academic",
      description: "Chapter 5-7 coverage",
      location: "Room 204",
    },
    {
      id: "3",
      title: "Project Submission",
      start: "2024-08-05",
      allDay: true,
      backgroundColor: "#10b981",
      borderColor: "#10b981",
      category: "work",
      description: "Final project deliverables",
      location: "Project Portal",
    },
    {
      id: "4",
      title: "Mid-term Exam",
      start: "2024-08-15T09:00:00",
      end: "2024-08-15T12:00:00",
      allDay: false,
      backgroundColor: "#3b82f6",
      borderColor: "#3b82f6",
      category: "academic",
      description: "Comprehensive mid-term examination",
      location: "Main Hall",
    },
    {
      id: "5",
      title: "Team Meeting",
      start: "2024-08-02T15:00:00",
      end: "2024-08-02T16:00:00",
      allDay: false,
      backgroundColor: "#8b5cf6",
      borderColor: "#8b5cf6",
      category: "meeting",
      description: "Weekly team sync and project updates",
      location: "Conference Room A",
    },
  ];

  const categories = [
    { id: "all", label: "All Events", color: "gray" },
    { id: "academic", label: "Academic", color: "blue" },
    { id: "work", label: "Work", color: "green" },
    { id: "meeting", label: "Meetings", color: "purple" },
    { id: "personal", label: "Personal", color: "pink" },
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
    }`}>
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-blue-500' : 'bg-blue-200'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-purple-500' : 'bg-purple-200'
        }`} />
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className={`backdrop-blur-xl border-b transition-all duration-300 ${
          darkMode 
            ? "bg-slate-900/80 border-slate-700/30" 
            : "bg-white/80 border-gray-200/30"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Title Section */}
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${
                  darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <CalendarIcon className={`w-8 h-8 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                    darkMode 
                      ? "from-white via-gray-200 to-gray-300" 
                      : "from-gray-900 via-gray-800 to-gray-700"
                  }`}>
                    Calendar
                  </h1>
                  <p className={`text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Manage your schedule and events
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button className={`group relative overflow-hidden px-4 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  darkMode 
                    ? "bg-slate-800/50 hover:bg-slate-700/60 text-gray-300 hover:text-white border border-slate-700/30" 
                    : "bg-white/60 hover:bg-white/80 text-gray-700 hover:text-gray-900 border border-gray-200/50 shadow-sm hover:shadow-md"
                }`}>
                  <span className="relative z-10 flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                
                <button className={`group relative overflow-hidden px-4 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  darkMode 
                    ? "bg-slate-800/50 hover:bg-slate-700/60 text-gray-300 hover:text-white border border-slate-700/30" 
                    : "bg-white/60 hover:bg-white/80 text-gray-700 hover:text-gray-900 border border-gray-200/50 shadow-sm hover:shadow-md"
                }`}>
                  <span className="relative z-10 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                  <span className="relative z-10 flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Event</span>
                  </span>
                  <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                    darkMode 
                      ? "bg-slate-800/50 border-slate-700/30 text-white placeholder-gray-400" 
                      : "bg-white/60 border-gray-200/50 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className={`w-4 h-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-2 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                    darkMode 
                      ? "bg-slate-800/50 border-slate-700/30 text-white" 
                      : "bg-white/60 border-gray-200/50 text-gray-900"
                  }`}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className={`flex items-center rounded-xl border ${
                darkMode ? 'border-slate-700/30 bg-slate-800/30' : 'border-gray-200/50 bg-white/30'
              }`}>
                {[
                  { id: "dayGridMonth", label: "Month" },
                  { id: "timeGridWeek", label: "Week" },
                  { id: "timeGridDay", label: "Day" }
                ].map((view) => (
                  <button
                    key={view.id}
                    onClick={() => handleViewChange(view.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentView === view.id
                        ? darkMode
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-blue-600 text-white shadow-lg"
                        : darkMode
                          ? "text-gray-400 hover:text-white hover:bg-slate-700/50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`backdrop-blur-xl rounded-3xl border shadow-2xl overflow-hidden ${
            darkMode 
              ? "bg-slate-800/40 border-slate-700/30" 
              : "bg-white/60 border-gray-200/30"
          }`}>
            <div className="p-6">
              <div className="calendar-container">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView={currentView}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "",
                  }}
                  events={filteredEvents}
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={3}
                  weekends={true}
                  height="auto"
                  eventContent={renderEventContent}
                  eventClassNames="custom-event"
                  dayHeaderClassNames="custom-day-header"
                  viewClassNames="custom-view"
                />
              </div>
            </div>
          </div>

          {/* Event Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Events", value: filteredEvents.length, color: "blue", icon: CalendarIcon },
              { label: "This Week", value: "12", color: "green", icon: Clock },
              { label: "Upcoming", value: "8", color: "purple", icon: MapPin },
              { label: "Completed", value: "24", color: "orange", icon: Users },
            ].map((stat, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? "bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60" 
                    : "bg-white/60 border-gray-200/30 hover:bg-white/80 shadow-sm hover:shadow-lg"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-bold mt-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    stat.color === 'blue' ? (darkMode ? 'bg-blue-500/20' : 'bg-blue-100') :
                    stat.color === 'green' ? (darkMode ? 'bg-green-500/20' : 'bg-green-100') :
                    stat.color === 'purple' ? (darkMode ? 'bg-purple-500/20' : 'bg-purple-100') :
                    (darkMode ? 'bg-orange-500/20' : 'bg-orange-100')
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.color === 'blue' ? (darkMode ? 'text-blue-400' : 'text-blue-600') :
                      stat.color === 'green' ? (darkMode ? 'text-green-400' : 'text-green-600') :
                      stat.color === 'purple' ? (darkMode ? 'text-purple-400' : 'text-purple-600') :
                      (darkMode ? 'text-orange-400' : 'text-orange-600')
                    }`} />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .calendar-container .fc {
          font-family: inherit;
        }
        
        .calendar-container .fc-theme-standard td,
        .calendar-container .fc-theme-standard th {
          border-color: ${darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(229, 231, 235, 0.5)'};
        }
        
        .calendar-container .fc-theme-standard .fc-scrollgrid {
          border-color: ${darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(229, 231, 235, 0.5)'};
        }
        
        .calendar-container .fc-col-header-cell {
          background: ${darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(249, 250, 251, 0.8)'};
          color: ${darkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)'};
          font-weight: 600;
          font-size: 0.875rem;
          padding: 12px 8px;
          border: none;
        }
        
        .calendar-container .fc-daygrid-day {
          background: ${darkMode ? 'rgba(30, 41, 59, 0.2)' : 'rgba(255, 255, 255, 0.4)'};
        }
        
        .calendar-container .fc-daygrid-day:hover {
          background: ${darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(249, 250, 251, 0.8)'};
        }
        
        .calendar-container .fc-day-today {
          background: ${darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'} !important;
        }
        
        .calendar-container .fc-daygrid-day-number {
          color: ${darkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'};
          font-weight: 500;
          padding: 8px;
          text-decoration: none;
        }
        
        .calendar-container .fc-day-today .fc-daygrid-day-number {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border-radius: 8px;
          font-weight: 700;
        }
        
        .calendar-container .fc-event {
          border: none !important;
          border-radius: 8px !important;
          padding: 2px 6px !important;
          margin: 1px 2px !important;
          font-size: 0.75rem !important;
          font-weight: 500 !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.2s ease !important;
        }
        
        .calendar-container .fc-event:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        
        .calendar-container .fc-toolbar {
          margin-bottom: 1.5rem !important;
        }
        
        .calendar-container .fc-toolbar-title {
          color: ${darkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'} !important;
          font-size: 1.5rem !important;
          font-weight: 700 !important;
        }
        
        .calendar-container .fc-button {
          background: ${darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(255, 255, 255, 0.8)'} !important;
          border: 1px solid ${darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(229, 231, 235, 0.5)'} !important;
          color: ${darkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)'} !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
        }
        
        .calendar-container .fc-button:hover {
          background: ${darkMode ? 'rgba(51, 65, 85, 0.7)' : 'rgba(249, 250, 251, 0.9)'} !important;
          color: ${darkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'} !important;
          transform: translateY(-1px) !important;
        }
        
        .calendar-container .fc-button:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }
        
        .calendar-container .fc-button-active {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
          color: white !important;
        }
        
        .calendar-container .fc-more-link {
          color: ${darkMode ? 'rgb(96, 165, 250)' : 'rgb(37, 99, 235)'} !important;
          font-weight: 500 !important;
        }
      `}</style>
    </div>
  );
};

function renderEventContent(eventInfo) {
  return (
    <div className="flex items-center space-x-1 truncate">
      <div className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />
      <span className="truncate font-medium">
        {eventInfo.event.title}
      </span>
    </div>
  );
}

export default Calendar;