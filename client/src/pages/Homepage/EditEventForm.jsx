import React, { useState } from "react";

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
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.start ? new Date(event.start).toISOString().slice(0,10) : "");
  const [startTime, setStartTime] = useState(event.start ? new Date(event.start).toISOString().slice(11,16) : "");
  const [endTime, setEndTime] = useState(event.end ? new Date(event.end).toISOString().slice(11,16) : "");
  const [category, setCategory] = useState(event.category);

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = date && startTime ? new Date(`${date}T${startTime}`) : null;
    const end = date && endTime ? new Date(`${date}T${endTime}`) : null;
    onSave({ ...event, title, description, start, end, category });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-2 bg-blue-50 dark:bg-zinc-800 rounded-xl shadow-lg p-6">
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Title</label>
        <input type="text" className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Description</label>
        <textarea className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
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
        <input type="date" className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition" value={date} onChange={e => setDate(e.target.value)} required />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Start Time</label>
          <input type="time" className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition" value={startTime} onChange={e => setStartTime(e.target.value)} required />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">End Time</label>
          <input type="time" className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition" value={endTime} onChange={e => setEndTime(e.target.value)} required />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition shadow">Save</button>
        <button type="button" className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition shadow" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
} 