import React, { useState } from "react";
import EventCard from "./EventCard";
import { FiPlus, FiX, FiEdit2, FiTrash2, FiClock, FiCalendar } from "react-icons/fi";
import AddEventModal from "./AddEventModal";
import EditEventForm from "./EditEventForm";
import api from "../../utils/api";
import AddToGoogleCalendarButton from "./AddToGoogleCalendarButton";

function isToday(date) {
  const d = new Date(date);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const MainTimeLine = ({ darkMode, events, setEvents }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Add event handler
  const handleAddEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  // Edit event handler
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

  // Delete event handler
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

  // Only show today's events, sorted by start time
  const todayEvents = events
    .filter(ev => ev.start && isToday(ev.start))
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className={`flex-1 min-h-screen transition-all duration-300 ${
      darkMode 
        ? "bg-gradient-to-br from-slate-900 to-slate-800" 
        : "bg-gradient-to-br from-gray-50 to-white"
    }`}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                Today's Timeline
              </h1>
              <div className="flex items-center space-x-2">
                <FiCalendar className={`w-5 h-5 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`} />
                <p className={`text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  {formattedDate}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className={`relative backdrop-blur-xl rounded-3xl border shadow-2xl overflow-hidden ${
          darkMode 
            ? "bg-slate-800/50 border-slate-700/50" 
            : "bg-white/70 border-gray-200/20"
        }`}>
          {/* Timeline Line */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500 to-purple-500 opacity-30" />
          
          <div className="p-8">
            {todayEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center mb-6 ${
                  darkMode 
                    ? "border-gray-600 text-gray-500" 
                    : "border-gray-300 text-gray-400"
                }`}>
                  <FiClock className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  No Events Today
                </h3>
                <p className={`text-center max-w-md ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}>
                  Your schedule is clear. Take some time to plan your day or add new events.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {todayEvents.map((event, idx) => {
                  const start = new Date(event.start);
                  const end = new Date(event.end);
                  const startStr = formatTime(start);
                  const endStr = formatTime(end);
                  const eventKey = event.id || event._id || `event-${idx}`;
                  
                  return (
                    <div key={eventKey} className="relative flex items-start space-x-6 group">
                      {/* Timeline Node */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full border-2 shadow-lg ${
                          darkMode 
                            ? "bg-slate-800 border-blue-500" 
                            : "bg-white border-blue-500"
                        }`} />
                        {idx !== todayEvents.length - 1 && (
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-blue-500/30 to-transparent" />
                        )}
                      </div>

                      {/* Event Card */}
                      <div className="flex-1 min-w-0">
                        <div 
                          className={`relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer transform hover:scale-[1.02] hover:shadow-xl ${
                            darkMode 
                              ? "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50" 
                              : "bg-white/80 border-gray-200/50 hover:bg-white"
                          }`}
                          onClick={() => { setSelectedEvent(event); setEditMode(false); }}
                        >
                          {/* Google Calendar Button */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <AddToGoogleCalendarButton event={event} small />
                          </div>

                          <div className="mb-4">
                            <h3 className={`text-lg font-semibold mb-2 ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}>
                              {event.title}
                            </h3>
                            {event.description && (
                              <p className={`text-sm mb-3 ${
                                darkMode ? "text-gray-300" : "text-gray-600"
                              }`}>
                                {event.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <FiClock className={`w-4 h-4 ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`} />
                                <span className={`text-sm font-medium ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}>
                                  {startStr} - {endStr}
                                </span>
                              </div>
                              {event.category && (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  darkMode 
                                    ? "bg-blue-500/20 text-blue-400" 
                                    : "bg-blue-100 text-blue-600"
                                }`}>
                                  {event.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Time Label */}
                      <div className="flex-shrink-0 w-20 text-right">
                        <span className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {startStr}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <AddEventModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleAddEvent}
        />

        {/* Event Details/Edit Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`relative w-full max-w-lg backdrop-blur-xl rounded-3xl border shadow-2xl ${
              darkMode 
                ? "bg-slate-800/95 border-slate-700/50" 
                : "bg-white/95 border-gray-200/50"
            }`}>
              <div className="p-8">
                <button
                  onClick={() => { setSelectedEvent(null); setEditMode(false); }}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                    darkMode 
                      ? "text-gray-400 hover:text-white hover:bg-slate-700" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiX className="w-5 h-5" />
                </button>

                {!editMode ? (
                  <>
                    <div className="mb-6">
                      <h2 className={`text-2xl font-bold mb-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {selectedEvent.title}
                      </h2>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          darkMode 
                            ? "bg-blue-500/20 text-blue-400" 
                            : "bg-blue-100 text-blue-600"
                        }`}>
                          {selectedEvent.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <FiClock className={`w-4 h-4 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`} />
                          <span className={`text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}>
                            {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedEvent.description && (
                      <div className="mb-6">
                        <p className={`${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {selectedEvent.description}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setEditMode(true)}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          darkMode 
                            ? "bg-blue-600 text-white hover:bg-blue-700" 
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        <FiEdit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(selectedEvent)}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          darkMode 
                            ? "bg-red-600 text-white hover:bg-red-700" 
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <EditEventForm 
                    event={selectedEvent} 
                    onSave={handleEditEvent} 
                    onCancel={() => setEditMode(false)} 
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

export default MainTimeLine;