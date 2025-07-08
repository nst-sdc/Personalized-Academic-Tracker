import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import EditEventForm from "./EditEventForm";
import AddEventModal from "./AddEventModal";
import api from "../../utils/api";
import AddToGoogleCalendarButton from "./AddToGoogleCalendarButton";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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
  const bgMain = darkMode ? "bg-[#0D0D0D]" : "bg-white";
  const textPrimary = darkMode ? "text-white" : "text-[#333333]";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-500";
  const textLight = darkMode ? "text-gray-300" : "text-gray-400";
  const highlightCardBg = darkMode ? "bg-[#2A2A2A]" : "bg-cyan-50";

  // State for week navigation and modal
  const today = new Date();
  const [weekRef, setWeekRef] = useState(getStartOfWeek(today));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  // Add event handler - Only update state, don't make API call
  const handleAddEvent = (newEvent) => {
    console.log('Adding event to state from LeftDateColumn:', newEvent);
    // Simply add the event to state - API call already happened in modal
    setEvents(prev => [...prev, newEvent]);
  };

  // Filter for all events in the selected week
  const weekStart = getStartOfWeek(weekRef);
  const weekEnd = getEndOfWeek(weekRef);
  const weekEvents = events
    .filter(ev => ev.start && new Date(ev.start) >= weekStart && new Date(ev.start) <= weekEnd)
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  // Week label (e.g., 'Apr 8 - Apr 14, 2024')
  const weekLabel = `${weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;

  // Edit and delete handlers
  const handleEditEvent = async (updatedEvent) => {
    try {
        console.log('Updating event:', updatedEvent);
        
        // Use _id if id is not available
        const eventId = updatedEvent.id || updatedEvent._id;
        
        if (!eventId) {
            alert('Event is missing an id! Edit will not work.');
            return;
        }
        
        const response = await api.put(`/events/${eventId}`, updatedEvent);
        console.log('Event updated:', response.data);
        
        // Update the event in state with the response data
        setEvents(prev => prev.map(ev => 
            (ev.id || ev._id) === eventId ? response.data.data : ev
        ));
        setSelectedEvent(null);
        setEditMode(false);
    } catch (error) {
        console.error('Error updating event:', error);
        alert(`Failed to update event: ${error.response?.data?.message || error.message}`);
    }
  };

  // Delete event handler - Fixed to use _id
  const handleDeleteEvent = async (eventToDelete) => {
    try {
        // Use _id if id is not available
        const eventId = eventToDelete.id || eventToDelete._id;
        
        console.log('Deleting event with ID:', eventId);
        console.log('Event object:', eventToDelete);
        console.log('ID type:', typeof eventId);
        console.log('ID value:', eventId);
        
        // Validate ID before making request
        if (!eventId) {
            alert('Invalid event ID');
            return;
        }
        
        const response = await api.delete(`/events/${eventId}`);
        console.log('Delete response:', response.data);
        
        // Remove from state using the correct ID
        setEvents(prev => prev.filter(ev => (ev.id || ev._id) !== eventId));
        setSelectedEvent(null);
        setEditMode(false);
        
        alert('Event deleted successfully');
    } catch (error) {
        console.error('Error deleting event:', error);
        console.error('Error response:', error.response?.data);
        alert(`Failed to delete event: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div
      className={`w-80 ${bgMain} p-6 flex-shrink-0 h-[calc(100vh-70px)] overflow-y-auto transition-colors duration-300 font-khula`}
    >
      <div className="flex items-center justify-between mb-8">
        <button aria-label="Previous week" className={`p-1 ${textLight}`} onClick={handlePrevWeek}>
          <IoIosArrowBack size={20} />
        </button>
        <h2 className={`text-lg font-medium ${textPrimary}`}>{weekLabel}</h2>
        <button aria-label="Next week" className={`p-1 ${textLight}`} onClick={handleNextWeek}>
          <IoIosArrowForward size={20} />
        </button>
      </div>

      <div className="mb-10">
        <div className="text-left">
          <span className={`text-3xl font-light ${textLight}`}>This </span>
          <span className={`text-5xl font-bold ${textPrimary}`}>Week</span>
        </div>
      </div>

      {weekEvents.length === 0 ? (
        <div className={`${highlightCardBg} rounded-lg p-6 mb-10 text-center text-lg font-semibold text-gray-400 dark:text-gray-500`}>
          No upcoming Classes/Sessions
        </div>
      ) : (
        weekEvents.map((ev, idx) => {
          const start = new Date(ev.start);
          const end = new Date(ev.end);
          const dayLetter = start.toLocaleDateString(undefined, { weekday: 'short' }).charAt(0);
          const dayNum = start.getDate();
          // Use _id if id is not available for the key
          const eventKey = ev.id || ev._id || `event-${idx}`;
          
          return (
            <div
              key={eventKey}
              className={`${highlightCardBg} rounded-lg p-4 mb-6 cursor-pointer relative`}
              onClick={() => { setSelectedEvent(ev); setEditMode(false); }}
            >
              {/* Add to Google Calendar small button */}
              <div className="absolute top-2 right-2 z-10" onClick={e => e.stopPropagation()}>
                <AddToGoogleCalendarButton event={ev} small />
              </div>
              <div className="flex items-center gap-3 mb-4">
                {start.toDateString() === today.toDateString() && <span className="bg-[#59C3C8] text-white text-xs px-2 py-1 rounded">Today</span>}
                <span className={`text-sm font-medium ${textPrimary}`}>{ev.title}</span>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <div className={`text-[60px] font-semibold leading-tight ${textPrimary}`}>{dayLetter}</div>
                <div className="flex-1 pt-1">
                  <div className={`font-medium text-base mb-1 ${textPrimary}`}>{ev.title}</div>
                  <div className={`text-xs ${textSecondary}`}>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className={`text-2xl font-light ${textLight}`}>{dayNum}{getDaySuffix(dayNum)}</div>
                <div className="text-right">
                  <div className={`text-sm font-medium mb-1 ${textPrimary}`}>{ev.title}</div>
                  <div className={`text-xs ${textSecondary}`}>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Event Details/Edit Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-blue-200 dark:border-blue-900">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-3xl transition-colors"
              onClick={() => { setSelectedEvent(null); setEditMode(false); }}
              aria-label="Close"
            >
              &times;
            </button>
            {!editMode ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-200">{selectedEvent.title}</h2>
                <div className="mb-2 text-gray-700 dark:text-gray-200"><b>Category:</b> {selectedEvent.category}</div>
                <div className="mb-2 text-gray-700 dark:text-gray-200"><b>Description:</b> {selectedEvent.description || '—'}</div>
                <div className="mb-2 text-gray-700 dark:text-gray-200"><b>Time:</b> {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="flex gap-2 mt-6">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition" onClick={() => setEditMode(true)}>Edit</button>
                  <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition" onClick={() => handleDeleteEvent(selectedEvent)}>Delete</button>
                </div>
              </>
            ) : (
              <EditEventForm event={selectedEvent} onSave={handleEditEvent} onCancel={() => setEditMode(false)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function getDaySuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export default LeftDateColumn;