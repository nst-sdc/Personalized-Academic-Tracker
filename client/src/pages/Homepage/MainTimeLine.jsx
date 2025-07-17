import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EventCard from "./EventCard";
import { FiPlus, FiX, FiEdit2, FiTrash2, FiClock, FiCalendar, FiMapPin, FiUser } from "react-icons/fi";
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
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

function formatDuration(start, end) {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const diffMs = endTime - startTime;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return diffMinutes > 0 ? `${diffHours}h ${diffMinutes}m` : `${diffHours}h`;
  }
  return `${diffMinutes}m`;
}

const MainTimeLine = ({ darkMode, events, setEvents }) => {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [highlightedEventId, setHighlightedEventId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle navigation state for highlighting events
  useEffect(() => {
    if (location.state?.highlightEvent) {
      setHighlightedEventId(location.state.highlightEvent);
      window.history.replaceState({}, document.title);
      
      setTimeout(() => {
        setHighlightedEventId(null);
      }, 3000);
    }
    
    if (location.state?.editEvent) {
      const eventToEdit = events.find(ev => (ev._id || ev.id) === location.state.editEvent);
      if (eventToEdit) {
        setSelectedEvent(eventToEdit);
        setEditMode(true);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state, events]);

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
      const response = await api.put(`/api/events/${eventId}`, updatedEvent);
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
      await api.delete(`/api/events/${eventId}`);
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

  // Generate time slots and create adaptive layout
  const generateAdaptiveTimeSlots = () => {
    const slots = [];
    const baseHeight = 80; // Base height for empty slots
    const eventHeight = 120; // Height for slots with events
    
    for (let hour = 9; hour <= 20; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      const hasEvent = todayEvents.some(event => {
        const eventHour = new Date(event.start).getHours();
        return eventHour === hour;
      });
      
      slots.push({
        time: timeSlot,
        height: hasEvent ? eventHeight : baseHeight,
        hasEvent
      });
    }
    
    return slots;
  };

  // Get current time position
  const getCurrentTimePosition = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    if (hours < 9 || hours > 20) return null;
    
    const timeSlots = generateAdaptiveTimeSlots();
    let totalHeight = 0;
    let currentSlotHeight = 0;
    
    for (let i = 0; i < timeSlots.length; i++) {
      const slotHour = parseInt(timeSlots[i].time.split(':')[0]);
      
      if (slotHour === hours) {
        currentSlotHeight = timeSlots[i].height;
        const minuteProgress = minutes / 60;
        totalHeight += currentSlotHeight * minuteProgress;
        break;
      } else if (slotHour < hours) {
        totalHeight += timeSlots[i].height;
      }
    }
    
    return totalHeight;
  };

  // Get event position for a specific time slot
  const getEventForTimeSlot = (timeSlot) => {
    const hour = parseInt(timeSlot.split(':')[0]);
    return todayEvents.find(event => {
      const eventHour = new Date(event.start).getHours();
      return eventHour === hour;
    });
  };

  // Get next event
  const getNextEvent = () => {
    const now = currentTime;
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    
    for (const event of todayEvents) {
      const eventStart = new Date(event.start);
      const eventTimeInMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
      
      if (eventTimeInMinutes > currentTimeInMinutes) {
        const timeDiff = eventTimeInMinutes - currentTimeInMinutes;
        const hours = Math.floor(timeDiff / 60);
        const minutes = timeDiff % 60;
        
        return {
          event,
          timeUntil: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
        };
      }
    }
    return null;
  };

  const timeSlots = generateAdaptiveTimeSlots();
  const currentTimePosition = getCurrentTimePosition();
  const nextEventInfo = getNextEvent();

  const currentDate = new Date();
  const dayNumber = currentDate.getDate();
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

  // Event color schemes
  const getEventColors = (category) => {
    const colorSchemes = {
      work: { 
        bg: darkMode ? 'bg-blue-900/20' : 'bg-blue-50', 
        border: darkMode ? 'border-blue-500/30' : 'border-blue-300', 
        text: darkMode ? 'text-blue-200' : 'text-blue-900',
        accent: 'bg-blue-500'
      },
      personal: { 
        bg: darkMode ? 'bg-green-900/20' : 'bg-green-50', 
        border: darkMode ? 'border-green-500/30' : 'border-green-300', 
        text: darkMode ? 'text-green-200' : 'text-green-900',
        accent: 'bg-green-500'
      },
      study: { 
        bg: darkMode ? 'bg-purple-900/20' : 'bg-purple-50', 
        border: darkMode ? 'border-purple-500/30' : 'border-purple-300', 
        text: darkMode ? 'text-purple-200' : 'text-purple-900',
        accent: 'bg-purple-500'
      },
      meeting: { 
        bg: darkMode ? 'bg-orange-900/20' : 'bg-orange-50', 
        border: darkMode ? 'border-orange-500/30' : 'border-orange-300', 
        text: darkMode ? 'text-orange-200' : 'text-orange-900',
        accent: 'bg-orange-500'
      },
      default: { 
        bg: darkMode ? 'bg-gray-900/20' : 'bg-gray-50', 
        border: darkMode ? 'border-gray-500/30' : 'border-gray-300', 
        text: darkMode ? 'text-gray-200' : 'text-gray-900',
        accent: 'bg-gray-500'
      }
    };

    return colorSchemes[category?.toLowerCase()] || colorSchemes.default;
  };

  return (
    <div className={`flex-1 min-h-screen transition-all duration-500 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className={`text-4xl font-light ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  {dayNumber}th,
                </span>
                <h1 className={`text-5xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  {dayName}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FiCalendar className={`w-5 h-5 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`} />
                  <span className={`text-lg ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {currentDate.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                {nextEventInfo && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-red-500 font-medium">
                      Next event in {nextEventInfo.timeUntil}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setModalOpen(true)}
              className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center space-x-3">
                <FiPlus className="w-5 h-5" />
                <span>Add Event</span>
              </div>
            </button>
          </div>
        </div>

        {/* Timeline Container */}
        <div className={`relative backdrop-blur-xl rounded-3xl border shadow-2xl overflow-hidden ${
          darkMode 
            ? "bg-gray-800/50 border-gray-700/50" 
            : "bg-white/80 border-gray-200/50"
        }`}>
          <div className="p-8">
            {todayEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center mb-6 ${
                  darkMode 
                    ? "border-gray-600 text-gray-500" 
                    : "border-gray-300 text-gray-400"
                }`}>
                  <FiClock className="w-10 h-10" />
                </div>
                <h3 className={`text-2xl font-semibold mb-3 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  No Events Today
                </h3>
                <p className={`text-center max-w-md text-lg ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}>
                  Your schedule is clear. Perfect time to plan your day or add new events.
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline Grid */}
                <div className="flex">
                  {/* Time Labels */}
                  <div className="w-20 flex-shrink-0">
                    <div className="space-y-0">
                      {timeSlots.map((slot, index) => (
                        <div
                          key={slot.time}
                          className="flex items-start justify-end pr-4"
                          style={{ height: `${slot.height}px` }}
                        >
                          <span className={`text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}>
                            {slot.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline Content */}
                  <div className="flex-1 relative ml-6">
                    <div className="relative">
                      {/* Grid Lines and Events */}
                      {timeSlots.map((slot, index) => {
                        const event = getEventForTimeSlot(slot.time);
                        
                        return (
                          <div
                            key={slot.time}
                            className="relative border-t border-gray-200/30 dark:border-gray-700/30"
                            style={{ height: `${slot.height}px` }}
                          >
                            {event && (
                              <div className="absolute inset-x-4 top-2 bottom-2">
                                <div
                                  className={`h-full rounded-xl border-2 border-dashed p-4 transition-all duration-300 cursor-pointer hover:shadow-lg group ${
                                    (() => {
                                      const colors = getEventColors(event.category);
                                      const isHighlighted = highlightedEventId === (event._id || event.id);
                                      return isHighlighted 
                                        ? `${colors.bg} ${colors.border} ring-2 ring-blue-400 ring-opacity-50` 
                                        : `${colors.bg} ${colors.border} hover:shadow-xl hover:scale-[1.02]`;
                                    })()
                                  }`}
                                  onClick={() => { setSelectedEvent(event); setEditMode(false); }}
                                >
                                  <div className="h-full flex flex-col justify-between">
                                    <div className="flex-1 min-h-0">
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1 min-w-0">
                                          <h4 className={`font-semibold text-lg leading-tight truncate ${
                                            getEventColors(event.category).text
                                          }`}>
                                            {event.title}
                                          </h4>
                                          {event.description && (
                                            <p className={`text-sm mt-1 opacity-75 line-clamp-2 ${
                                              getEventColors(event.category).text
                                            }`}>
                                              {event.description}
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                                          <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                                            darkMode 
                                              ? "bg-gray-700 text-gray-300" 
                                              : "bg-white text-gray-600"
                                          }`}>
                                            {formatDuration(event.start, event.end)}
                                          </span>
                                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <AddToGoogleCalendarButton event={event} small />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm mt-2">
                                      <div className="flex items-center space-x-4">
                                        <span className={`flex items-center space-x-1 ${
                                          getEventColors(event.category).text
                                        } opacity-75`}>
                                          <FiClock className="w-3 h-3 flex-shrink-0" />
                                          <span className="truncate">
                                            {formatTime(event.start)} - {formatTime(event.end)}
                                          </span>
                                        </span>
                                        {event.location && (
                                          <span className={`flex items-center space-x-1 ${
                                            getEventColors(event.category).text
                                          } opacity-75`}>
                                            <FiMapPin className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">{event.location}</span>
                                          </span>
                                        )}
                                      </div>
                                      
                                      {event.category && (
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                          darkMode 
                                            ? "bg-gray-700 text-gray-300" 
                                            : "bg-white text-gray-600"
                                        }`}>
                                          {event.category}
                                        </span>
                                      )}
                                    </div>

                                    {/* Participants */}
                                    {event.participants && event.participants.length > 0 && (
                                      <div className="flex items-center space-x-2 mt-2">
                                        <div className="flex -space-x-2">
                                          {event.participants.slice(0, 3).map((participant, idx) => (
                                            <div
                                              key={idx}
                                              className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm"
                                            >
                                              {participant.charAt(0).toUpperCase()}
                                            </div>
                                          ))}
                                          {event.participants.length > 3 && (
                                            <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium shadow-sm ${
                                              darkMode 
                                                ? "bg-gray-600 text-gray-300" 
                                                : "bg-gray-200 text-gray-600"
                                            }`}>
                                              +{event.participants.length - 3}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Current Time Indicator */}
                      {currentTimePosition && (
                        <div
                          className="absolute left-0 right-0 z-20"
                          style={{ top: `${currentTimePosition}px` }}
                        >
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                            <div className="flex-1 h-0.5 bg-blue-500" />
                            <div className="ml-3 bg-blue-500 text-white text-sm px-3 py-1 rounded-lg font-medium shadow-lg">
                              {formatTime(currentTime)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto backdrop-blur-xl rounded-3xl border shadow-2xl ${
              darkMode 
                ? "bg-gray-800/95 border-gray-700/50" 
                : "bg-white/95 border-gray-200/50"
            }`}>
              <div className="p-8">
                <button
                  onClick={() => { setSelectedEvent(null); setEditMode(false); }}
                  className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-200 ${
                    darkMode 
                      ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiX className="w-5 h-5" />
                </button>

                {!editMode ? (
                  <>
                    <div className="mb-8">
                      <h2 className={`text-3xl font-bold mb-4 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {selectedEvent.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {selectedEvent.category && (
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            darkMode 
                              ? "bg-blue-500/20 text-blue-400" 
                              : "bg-blue-100 text-blue-600"
                          }`}>
                            {selectedEvent.category}
                          </span>
                        )}
                        <div className="flex items-center space-x-2">
                          <FiClock className={`w-4 h-4 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`} />
                          <span className={`text-sm font-medium ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}>
                            {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                          </span>
                          <span className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}>
                            ({formatDuration(selectedEvent.start, selectedEvent.end)})
                          </span>
                        </div>
                      </div>
                      {selectedEvent.location && (
                        <div className="flex items-center space-x-2 mb-4">
                          <FiMapPin className={`w-4 h-4 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`} />
                          <span className={`text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}>
                            {selectedEvent.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {selectedEvent.description && (
                      <div className="mb-8">
                        <h3 className={`text-lg font-semibold mb-3 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                          Description
                        </h3>
                        <p className={`leading-relaxed ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {selectedEvent.description}
                        </p>
                      </div>
                    )}

                    {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                      <div className="mb-8">
                        <h3 className={`text-lg font-semibold mb-3 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                          Participants
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedEvent.participants.map((participant, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                                darkMode 
                                  ? "bg-gray-700 text-gray-300" 
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <FiUser className="w-4 h-4" />
                              <span className="text-sm">{participant}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <FiEdit2 className="w-5 h-5" />
                        <span>Edit Event</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(selectedEvent)}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <FiTrash2 className="w-5 h-5" />
                        <span>Delete Event</span>
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

export default MainTimeLine;