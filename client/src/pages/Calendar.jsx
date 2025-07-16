import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, Filter, Search, Download, Settings } from "lucide-react";
import AddEventModal from "./Homepage/AddEventModal";

const Calendar = ({ darkMode, events = [], setEvents }) => {
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateEvents, setShowDateEvents] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);

  // Get events for the selected date
  const eventsForSelectedDate = selectedDate
    ? events.filter(event => {
        const eventDate = new Date(event.start);
        const selDate = new Date(selectedDate);
        return (
          eventDate.getFullYear() === selDate.getFullYear() &&
          eventDate.getMonth() === selDate.getMonth() &&
          eventDate.getDate() === selDate.getDate()
        );
      })
    : [];

  // Handle date click
  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setShowDateEvents(true);
  };

  // Helper functions for event stats
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  // Get start and end of current week (Monday-Sunday)
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const getEndOfWeek = (date) => {
    const d = getStartOfWeek(date);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  };
  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = getEndOfWeek(now);

  // Events in current month
  const eventsThisMonth = events.filter(event => {
    const d = new Date(event.start);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  // Events in current week
  const eventsThisWeek = events.filter(event => {
    const d = new Date(event.start);
    return d >= startOfWeek && d <= endOfWeek;
  });

  // Events today and tomorrow
  const startOfToday = new Date(year, month, today, 0, 0, 0, 0);
  const endOfTomorrow = new Date(year, month, today + 1, 23, 59, 59, 999);
  const eventsUpcoming = events.filter(event => {
    const d = new Date(event.start);
    return d >= startOfToday && d <= endOfTomorrow;
  });

  // Completed events (before today, in this month)
  const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const startOfTodayForCompleted = new Date(year, month, today, 0, 0, 0, 0);
  const eventsCompleted = events.filter(event => {
    const d = new Date(event.start);
    return d >= startOfMonth && d < startOfTodayForCompleted;
  });

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
              <div className="flex items-center">
                <button
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  onClick={() => setAddEventOpen(true)}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Event</span>
                  </span>
                  <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            {/* Removed search bar and category filter */}
            {/* Removed Month/Week/Day view toggle bar */}
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
                  initialView={"dayGridMonth"}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "",
                  }}
                  events={events}
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
                  dateClick={handleDateClick}
                />
              </div>
            </div>
          </div>

          {/* Event Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={`group relative overflow-hidden backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:scale-105 ${
              darkMode 
                ? "bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60" 
                : "bg-white/60 border-gray-200/30 hover:bg-white/80 shadow-sm hover:shadow-lg"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Total Events</p>
                  <p className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}>{eventsThisMonth.length}</p>
                </div>
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <CalendarIcon className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className={`group relative overflow-hidden backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:scale-105 ${
              darkMode 
                ? "bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60" 
                : "bg-white/60 border-gray-200/30 hover:bg-white/80 shadow-sm hover:shadow-lg"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>This Week</p>
                  <p className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}>{eventsThisWeek.length}</p>
                </div>
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                  <Clock className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className={`group relative overflow-hidden backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:scale-105 ${
              darkMode 
                ? "bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60" 
                : "bg-white/60 border-gray-200/30 hover:bg-white/80 shadow-sm hover:shadow-lg"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Upcoming</p>
                  <p className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}>{eventsUpcoming.length}</p>
                </div>
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <MapPin className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className={`group relative overflow-hidden backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:scale-105 ${
              darkMode 
                ? "bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60" 
                : "bg-white/60 border-gray-200/30 hover:bg-white/80 shadow-sm hover:shadow-lg"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Completed</p>
                  <p className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}>{eventsCompleted.length}</p>
                </div>
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                  <Users className={`w-6 h-6 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for events on selected date */}
      {showDateEvents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative`}>
            <button
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500"
              onClick={() => setShowDateEvents(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Events on {selectedDate}
            </h2>
            {eventsForSelectedDate.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400">No events for this date.</div>
            ) : (
              <ul className="space-y-4">
                {eventsForSelectedDate.map(event => (
                  <li key={event._id || event.id} className="p-4 rounded-xl border dark:border-slate-600 border-gray-200 bg-gray-50 dark:bg-slate-700">
                    <div className="font-semibold text-gray-900 dark:text-white">{event.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{event.description}</div>
                    <div className="text-xs mt-1 text-gray-400 dark:text-gray-400">
                      {event.start ? new Date(event.start).toLocaleString() : ''}
                      {event.end ? ` - ${new Date(event.end).toLocaleString()}` : ''}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      <AddEventModal
        open={addEventOpen}
        onClose={() => setAddEventOpen(false)}
        onSave={newEvent => {
          setEvents(prev => [...prev, newEvent]);
        }}
      />

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