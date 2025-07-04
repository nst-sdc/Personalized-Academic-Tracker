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

export default function AddEventModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Validate end time is after start time
      if (startTime && endTime && startTime >= endTime) {
        setError("End time must be after start time");
        setLoading(false);
        return;
      }

      // Create proper ISO date strings
      const start = date && startTime ? new Date(`${date}T${startTime}:00.000Z`) : null;
      const end = date && endTime ? new Date(`${date}T${endTime}:00.000Z`) : null;
      
      console.log("Sending event data:", {
        title,
        description,
        start,
        end,
        category
      });

      const response = await api.post('/events', {
        title: title.trim(),
        description: description.trim(),
        start,
        end,
        category
      });
      
      console.log("Event created successfully:", response.data);
      
      // Call the onSave callback with the new event
      onSave(response.data.data || response.data);
      
      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setCategory(categories[0]);
      setError("");
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Error creating event:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            `Server error: ${error.response.status}`;
        setError(errorMessage);
        console.log("Server error response:", error.response.data);
      } else if (error.request) {
        // Network error
        setError("Network error. Please check your connection.");
      } else {
        // Other error
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
      <div className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 rounded-3xl shadow-2xl p-10 w-full max-w-lg border-2 border-blue-200 dark:border-blue-900 animate-slide-up">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-3xl transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-tight text-blue-700 dark:text-blue-200 drop-shadow-sm">Add New Event</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 bg-white/80 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm focus:shadow-lg transition placeholder-gray-400 dark:placeholder-zinc-500 hover:border-blue-300"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Event title"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Description</label>
            <textarea
              className="w-full border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 bg-white/80 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm focus:shadow-lg transition placeholder-gray-400 dark:placeholder-zinc-500 hover:border-blue-300"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Event description (optional)"
              maxLength={500}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Category</label>
            <div className="relative">
              <select
                className="w-full border border-blue-300 dark:border-blue-800 rounded-xl px-4 py-2.5 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm focus:shadow-lg transition font-semibold appearance-none pr-8 hover:border-blue-400"
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
              className="w-full border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 bg-white/80 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm focus:shadow-lg transition hover:border-blue-300"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Start Time</label>
              <input
                type="time"
                className="w-full border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 bg-white/80 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm focus:shadow-lg transition hover:border-blue-300"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">End Time</label>
              <input
                type="time"
                className="w-full border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 bg-white/80 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm focus:shadow-lg transition hover:border-blue-300"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed mt-4 tracking-wide drop-shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                Adding...
              </span>
            ) : (
              "Add Event"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}