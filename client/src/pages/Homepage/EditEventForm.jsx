import React, { useState } from "react";
import api from "../../utils/api";

const categories = [
  "Class",
  "Assignment",
  "Meeting",
  "Masterclass",
  "Quiz",
  "Contest",
  "Practice",
  "Other",
];

export default function EditEventForm({ event, onSave, onCancel }) {
  // Helper function to properly format date/time from event data
  const formatDateFromEvent = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  const formatTimeFromEvent = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toTimeString().slice(0, 5); // HH:MM
  };

  // Helper to parse date and time as local time (not UTC)
  function parseLocalDateTime(dateStr, timeStr) {
    // dateStr: 'YYYY-MM-DD', timeStr: 'HH:mm' (24h or 12h)
    if (!dateStr || !timeStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hourStr, minuteStr] = timeStr.split(':');
    let hour = Number(hourStr);
    let minute = Number(minuteStr);
    // If timeStr includes AM/PM, handle it
    if (/am|pm/i.test(timeStr)) {
      const isPM = /pm/i.test(timeStr);
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
    }
    return new Date(year, month - 1, day, hour, minute, 0, 0);
  }

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(formatDateFromEvent(event.start));
  const [startTime, setStartTime] = useState(formatTimeFromEvent(event.start));
  const [endTime, setEndTime] = useState(formatTimeFromEvent(event.end));
  const [category, setCategory] = useState(event.category);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Robust time validation using local time
      if (date && startTime && endTime) {
        const startDate = parseLocalDateTime(date, startTime);
        const endDate = parseLocalDateTime(date, endTime);
        if (!startDate || !endDate) {
          setError("Invalid start or end time");
          setLoading(false);
          return;
        }
        if (endDate <= startDate) {
          setError("End time must be after start time");
          setLoading(false);
          return;
        }
      }

      // Create proper date objects in local timezone (not UTC)
      const start = date && startTime ? new Date(`${date}T${startTime}:00`) : null;
      const end = date && endTime ? new Date(`${date}T${endTime}:00`) : null;
      
      console.log("Updating event data:", {
        title,
        description,
        start,
        end,
        category
      });

      const eventId = event.id || event._id;
      const response = await api.put(`/events/${eventId}`, {
        title: title.trim(),
        description: description.trim(),
        start,
        end,
        category
      });
      
      console.log("Event updated successfully:", response.data);
      onSave(response.data.data);
      
    } catch (error) {
      console.error('Error updating event:', error);
      
      // Handle different types of errors
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            `Server error: ${error.response.status}`;
        setError(errorMessage);
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-2 bg-blue-50 dark:bg-zinc-800 rounded-xl shadow-lg p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Title</label>
        <input 
          type="text" 
          className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          maxLength={100}
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Description</label>
        <textarea 
          className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          rows={2}
          maxLength={500}
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Category</label>
        <div className="relative">
          <select
            className="w-full border border-blue-300 dark:border-blue-800 rounded-xl px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition font-semibold appearance-none pr-8 hover:border-blue-400"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 dark:text-blue-300 text-lg">▼</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Date</label>
        <input 
          type="date" 
          className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
          value={date} 
          onChange={e => setDate(e.target.value)} 
          required 
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Start Time</label>
          <input 
            type="time" 
            className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
            value={startTime} 
            onChange={e => setStartTime(e.target.value)} 
            required 
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">End Time</label>
          <input 
            type="time" 
            className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
            value={endTime} 
            onChange={e => setEndTime(e.target.value)} 
            required 
          />
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button 
          type="submit" 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition shadow disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button 
          type="button" 
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition shadow" 
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}