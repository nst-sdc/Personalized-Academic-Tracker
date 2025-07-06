import React, { useState } from "react";
import EventCard from "./EventCard";
import { MdAdd, MdClose, MdEdit, MdDelete } from "react-icons/md";
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

  return (
    <div className={`flex-1 flex flex-col items-center justify-center ${darkMode ? "bg-black text-white" : "bg-gray-50 text-black"} transition-colors duration-300`}>
      <main className="w-full max-w-3xl mx-auto flex-1 overflow-y-auto px-2 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Today's Timeline</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className={`relative rounded-3xl shadow-xl p-8 min-h-[350px] ${darkMode ? "bg-[#18181b] border border-gray-800" : "bg-white border border-gray-200"}`}>
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-400 to-indigo-400 dark:from-blue-900 dark:to-indigo-900 rounded-full z-0" style={{ minHeight: 'calc(100% - 4rem)' }} />
          {todayEvents.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-lg font-semibold text-gray-400 dark:text-gray-500">No Events Today</div>
          ) : (
            <ul className="relative z-10 flex flex-col gap-10">
              {todayEvents.map((event, idx) => {
                const start = new Date(event.start);
                const end = new Date(event.end);
                const startStr = formatTime(start);
                const endStr = formatTime(end);
                const eventKey = event.id || event._id || `event-${idx}`;
                return (
                  <li key={eventKey} className="flex items-center group">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center mr-8">
                      <span className={`w-5 h-5 rounded-full border-4 ${darkMode ? "border-blue-900 bg-[#18181b]" : "border-blue-400 bg-white"} shadow-lg z-10`} />
                      {idx !== todayEvents.length - 1 && <div className="flex-1 w-1 bg-blue-200 dark:bg-blue-900" />}
                    </div>
                    {/* Event Card with Google button at top left inside card */}
                    <div className="flex-1 transition-transform duration-200 group-hover:scale-[1.025] group-hover:shadow-2xl cursor-pointer relative" onClick={() => { setSelectedEvent(event); setEditMode(false); }}>
                      {/* Add to Google Calendar small button at top left inside card */}
                      <div className="absolute top-2 left-2 z-10" onClick={e => e.stopPropagation()}>
                        <AddToGoogleCalendarButton event={event} small />
                      </div>
                      <EventCard
                        title={event.title}
                        start={startStr}
                        end={endStr}
                        duration={null}
                        bgColor="bg-[#E3F2FD] dark:bg-[#1e293b]"
                        borderColor="border-[#2196F3] dark:border-[#60a5fa]"
                        textColor="text-[#1976D2] dark:text-[#60a5fa]"
                        avatars={1}
                        height={100}
                        category={event.category}
                      />
                    </div>
                    {/* Time Label */}
                    <div className="ml-6 min-w-[70px] text-right text-sm text-gray-500 dark:text-gray-400 font-semibold">
                      {startStr}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {/* Add Event Floating Button */}
          <button
            className="fixed bottom-10 right-10 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-4xl transition-all duration-200 z-30 group"
            aria-label="Add new event"
            onClick={() => setModalOpen(true)}
            title="Add Event"
          >
            <MdAdd />
            <span className="sr-only">Add Event</span>
          </button>
        </div>
        <AddEventModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleAddEvent}
        />
        {/* Event Details/Edit Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-blue-200 dark:border-blue-900">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-3xl transition-colors"
                onClick={() => { setSelectedEvent(null); setEditMode(false); }}
                aria-label="Close"
              >
                <MdClose />
              </button>
              {!editMode ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-200">{selectedEvent.title}</h2>
                  <div className="mb-2 text-gray-700 dark:text-gray-200"><b>Category:</b> {selectedEvent.category}</div>
                  <div className="mb-2 text-gray-700 dark:text-gray-200"><b>Description:</b> {selectedEvent.description || '—'}</div>
                  <div className="mb-2 text-gray-700 dark:text-gray-200"><b>Time:</b> {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}</div>
                  <div className="flex gap-2 mt-6">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition flex items-center justify-center gap-2" onClick={() => setEditMode(true)}><MdEdit /> Edit</button>
                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition flex items-center justify-center gap-2" onClick={() => handleDeleteEvent(selectedEvent)}><MdDelete /> Delete</button>
                  </div>
                </>
              ) : (
                <EditEventForm event={selectedEvent} onSave={handleEditEvent} onCancel={() => setEditMode(false)} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainTimeLine;