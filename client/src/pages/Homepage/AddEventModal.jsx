import React, { useState } from "react";

export default function AddEventModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const start = date && startTime ? new Date(`${date}T${startTime}`) : null;
    const end = date && endTime ? new Date(`${date}T${endTime}`) : null;
    await onSave({ title, description, start, end });
    setLoading(false);
    setTitle("");
    setDescription("");
    setDate("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-200 dark:border-zinc-700 animate-slide-up">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-3xl transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center tracking-tight text-gray-900 dark:text-white">Add New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Event title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Description</label>
            <textarea
              className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Event description (optional)"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Start Time</label>
              <input
                type="time"
                className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">End Time</label>
              <input
                type="time"
                className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2.5 rounded-lg shadow-md transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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