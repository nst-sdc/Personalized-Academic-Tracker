import React, { useState } from "react";
import EventCard from "./EventCard";
import { MdHome, MdSearch, MdPieChart, MdAccessTime, MdPerson } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaCircle, FaMinus } from "react-icons/fa";
import AddEventModal from "./AddEventModal";
import EditEventForm from "./EditEventForm";
import api from "../../utils/api";

// Timeline starts at 11:00
const timelineStartHour = 11;
const pixelsPerMinute = 2.5;

function calculateTopFromTime(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const totalMinutes = (hours - timelineStartHour) * 60 + minutes;
  return totalMinutes * pixelsPerMinute;
}

const times = ["11:00", "12:00", "13:00", "14:00", "15:00"];

function isToday(date) {
  const d = new Date(date);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const MainTimeLine = ({ darkMode, events, setEvents }) => {
  const [activeNav, setActiveNav] = useState("Home");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Add event handler (shared state)
  const handleAddEvent = async (eventData) => {
    try {
        console.log('Creating event:', eventData);
        const response = await api.post('/events', eventData);
        console.log('Event created:', response.data);
        
        // Add the new event with the real ID from the database
        setEvents(prev => [...prev, response.data.data]);
        setModalOpen(false);
    } catch (error) {
        console.error('Error creating event:', error);
        alert(`Failed to create event: ${error.response?.data?.message || error.message}`);
    }
};

// Edit event handler - Fixed to use _id
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

  // Only show today's events, sorted by start time
  const todayEvents = events
    .filter(ev => ev.start && isToday(ev.start))
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  return (
    <div className={`flex-1 flex flex-col ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <main className="flex-1 overflow-y-auto pl-8 pr-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Today's Timeline</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        {todayEvents.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-lg font-semibold text-gray-400 dark:text-gray-500">No Events Today</div>
        ) : (
          <div className="space-y-8">
            {todayEvents.map((event, idx) => {
              const start = new Date(event.start);
              const end = new Date(event.end);
              const startStr = formatTime(start);
              const endStr = formatTime(end);
              // Use _id if id is not available for the key
              const eventKey = event.id || event._id || `event-${idx}`;
              
              return (
                <div key={eventKey} className="flex items-start gap-4 group cursor-pointer" onClick={() => { setSelectedEvent(event); setEditMode(false); }}>
                  <div className="min-w-[64px] text-right pt-2">
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-300">{startStr}</span>
                  </div>
                  <div className="flex-1">
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
                </div>
              );
            })}
          </div>
        )}
        <button
          className="fixed bottom-8 right-8 bg-[#FF5722] text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 z-20"
          aria-label="Add new event"
          onClick={() => setModalOpen(true)}
        >
          <span className="text-2xl font-light leading-none">+</span>
          <span className="text-[15px] font-medium">Add Event</span>
        </button>
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
                &times;
              </button>
              {!editMode ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-200">{selectedEvent.title}</h2>
                  <div className="mb-2 text-gray-700 dark:text-gray-200"><b>Category:</b> {selectedEvent.category}</div>
                  <div className="mb-2 text-gray-700 dark:text-gray-200"><b>Description:</b> {selectedEvent.description || '—'}</div>
                  <div className="mb-2 text-gray-700 dark:text-gray-200"><b>Time:</b> {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}</div>
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
      </main>
    </div>
  );
};

export default MainTimeLine;