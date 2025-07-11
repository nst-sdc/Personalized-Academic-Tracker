import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock } from "react-icons/fi";
import EditEventForm from "./EditEventForm";
import AddEventModal from "./AddEventModal";
import api from "../../utils/api";
import AddToGoogleCalendarButton from "./AddToGoogleCalendarButton";

function getStartOfWeek(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndOfWeek(date) {
  const d = getStartOfWeek(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

const LeftDateColumn = ({ darkMode, events = [], setEvents }) => {
  const today = new Date();
  const [weekRef, setWeekRef] = useState(getStartOfWeek(today));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handlePrevWeek = () => {
    setWeekRef(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return getStartOfWeek(d);
    });
  };

  const handleNextWeek = () => {
    setWeekRef(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return getStartOfWeek(d);
    });
  };

  const handleAddEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  // Filter for all events in the selected week
  const weekStart = getStartOfWeek(weekRef);
  const weekEnd = getEndOfWeek(weekRef);
  const weekEvents = events
    .filter(ev => ev.start && new Date(ev.start) >= weekStart && new Date(ev.start) <= weekEnd)
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  const weekLabel = `${weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const handleEditEvent = async (updatedEvent) => {
    try {
      const eventId = updatedEvent.id || updatedEvent._id;
      if (!eventId) {
        alert('Event is missing an id! Edit will not work.');
        return;
      }
      const response = await api.put(`/events/${eventId}`, updatedEvent);
      setEvents(prev => prev.map(ev => (ev.id || ev._id) === eventId ? response.data.data : ev));
      setSelectedEvent(null);
      setEditMode(false);
    } catch (error) {
      alert(`Failed to update event: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteEvent = async (eventToDelete) => {
    try {
      const eventId = eventToDelete.id || eventToDelete._id;
      if (!eventId) {
        alert('Invalid event ID');
        return;
      }
      await api.delete(`/events/${eventId}`);
      setEvents(prev => prev.filter(ev => (ev.id || ev._id) !== eventId));
      setSelectedEvent(null);
      setEditMode(false);
    } catch (error) {
      alert(`Failed to delete event: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className={`w-80 h-screen backdrop-blur-xl border-r transition-all duration-300 ${
      darkMode 
        ? "bg-slate-900/95 border-slate-700/50" 
        : "bg-white/95 border-gray-200/50"
    }`}>
      <div className="p-6 h-full overflow-y-auto">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handlePrevWeek}
            className={`p-2 rounded-xl transition-all duration-200 ${
              darkMode 
                ? "text-gray-400 hover:text-white hover:bg-slate-800" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className={`text-sm font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              {weekLabel}
            </h2>
          </div>
          
          <button
            onClick={handleNextWeek}
            className={`p-2 rounded-xl transition-all duration-200 ${
              darkMode 
                ? "text-gray-400 hover:text-white hover:bg-slate-800" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            This Week
          </h1>
          <p className={`text-sm mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            {weekEvents.length} events scheduled
          </p>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {weekEvents.length === 0 ? (
            <div className={`p-6 rounded-2xl border-2 border-dashed text-center ${
              darkMode 
                ? "border-gray-600 bg-slate-800/30" 
                : "border-gray-300 bg-gray-50"
            }`}>
              <FiCalendar className={`w-8 h-8 mx-auto mb-3 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`} />
              <p className={`text-sm font-medium ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                No events this week
              </p>
            </div>
          ) : (
            weekEvents.map((event, idx) => {
              const start = new Date(event.start);
              const end = new Date(event.end);
              const isToday = start.toDateString() === today.toDateString();
              const eventKey = event.id || event._id || `event-${idx}`;
              
              return (
                <div
                  key={eventKey}
                  className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-lg ${
                    darkMode 
                      ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/80" 
                      : "bg-white/80 border-gray-200/50 hover:bg-white"
                  } ${isToday ? 'ring-2 ring-blue-500/20' : ''}`}
                  onClick={() => { setSelectedEvent(event); setEditMode(false); }}
                >
                  {/* Google Calendar Button */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <AddToGoogleCalendarButton event={event} small />
                  </div>

                  {/* Today Badge */}
                  {isToday && (
                    <div className="absolute -top-2 -right-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                      Today
                    </div>
                  )}

                  {/* Event Content */}
                  <div className="mb-3">
                    <h3 className={`font-semibold mb-1 pr-8 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {event.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <FiClock className={`w-4 h-4 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <span className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}>
                        {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  {event.category && (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      darkMode 
                        ? "bg-blue-500/20 text-blue-400" 
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      {event.category}
                    </span>
                  )}

                  {/* Day Info */}
                  <div className="mt-3 pt-3 border-t border-gray-200/20">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        {start.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
                      </span>
                      <span className={`text-xs ${
                        darkMode ? "text-gray-500" : "text-gray-500"
                      }`}>
                        {start.toLocaleDateString(undefined, { month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto backdrop-blur-xl rounded-3xl border shadow-2xl ${
              darkMode 
                ? "bg-slate-800/95 border-slate-700/50" 
                : "bg-white/95 border-gray-200/50"
            }`}>
              <div className="p-6">
                <button
                  onClick={() => { setSelectedEvent(null); setEditMode(false); }}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                    darkMode 
                      ? "text-gray-400 hover:text-white hover:bg-slate-700" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ×
                </button>

                {!editMode ? (
                  <>
                    <h2 className={`text-xl font-bold mb-4 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {selectedEvent.title}
                    </h2>
                    <div className="space-y-3 mb-6">
                      <div className={`${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                        <strong>Category:</strong> {selectedEvent.category}
                      </div>
                      <div className={`${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                        <strong>Description:</strong> {selectedEvent.description || '—'}
                      </div>
                      <div className={`${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                        <strong>Time:</strong> {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(selectedEvent)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <EditEventForm 
                    event={selectedEvent} 
                    onSave={handleEditEvent} 
                    onCancel={() => setEditMode(false)} 
                    darkMode={darkMode}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftDateColumn;