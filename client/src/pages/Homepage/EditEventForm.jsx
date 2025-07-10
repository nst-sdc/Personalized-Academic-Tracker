import React, { useState } from "react";
import { FiCalendar, FiClock, FiType, FiAlignLeft } from "react-icons/fi";
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

const categoryColors = {
  Class: "from-blue-500 to-blue-600",
  Assignment: "from-green-500 to-green-600",
  Meeting: "from-purple-500 to-purple-600",
  Masterclass: "from-yellow-500 to-yellow-600",
  Quiz: "from-pink-500 to-pink-600",
  Contest: "from-red-500 to-red-600",
  Practice: "from-teal-500 to-teal-600",
  Other: "from-gray-500 to-gray-600",
};

export default function EditEventForm({ event, onSave, onCancel }) {
  const formatDateFromEvent = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 10);
  };

  const formatTimeFromEvent = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toTimeString().slice(0, 5);
  };

  const [title, setTitle] = useState(event.title || "");
  const [description, setDescription] = useState(event.description || "");
  const [date, setDate] = useState(formatDateFromEvent(event.start));
  const [startTime, setStartTime] = useState(formatTimeFromEvent(event.start));
  const [endTime, setEndTime] = useState(formatTimeFromEvent(event.end));
  const [category, setCategory] = useState(event.category || categories[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (startTime && endTime && startTime >= endTime) {
        setError("End time must be after start time");
        setLoading(false);
        return;
      }

      const start = date && startTime ? new Date(`${date}T${startTime}:00`) : null;
      const end = date && endTime ? new Date(`${date}T${endTime}:00`) : null;

      const eventId = event.id || event._id;
      const response = await api.put(`/events/${eventId}`, {
        title: title.trim(),
        description: description.trim(),
        start,
        end,
        category
      });

      onSave(response.data.data);
      
    } catch (error) {
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
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Event
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Update event details
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <FiType className="w-4 h-4" />
            <span>Event Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter event title"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <FiAlignLeft className="w-4 h-4" />
            <span>Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
            placeholder="Add a description (optional)"
            rows={3}
            maxLength={500}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-3 rounded-2xl border-2 transition-all duration-200 ${
                  category === cat
                    ? `bg-gradient-to-r ${categoryColors[cat]} text-white border-transparent shadow-lg`
                    : 'border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'
                }`}
              >
                <span className="text-sm font-medium">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <FiCalendar className="w-4 h-4" />
            <span>Date</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <FiClock className="w-4 h-4" />
              <span>Start Time</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <FiClock className="w-4 h-4" />
              <span>End Time</span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              loading ? 'animate-pulse' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}