import React, { useState } from "react";
import { FiX, FiEdit2, FiTrash2, FiCalendar, FiClock, FiType } from "react-icons/fi";
import EditEventForm from "./EditEventForm";

const categoryColors = {
  Class: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  Assignment: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  Meeting: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  Masterclass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  Quiz: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  Contest: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
  Practice: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200",
  Other: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function EventDetailModal({ event, isOpen, onClose, darkMode, onEdit, onDelete }) {
  const [editMode, setEditMode] = useState(false);

  console.log('EventDetailModal props:', { event, isOpen, darkMode });
  console.log('EventDetailModal rendering check - isOpen:', isOpen, 'event:', !!event, 'event title:', event?.title);

  if (!isOpen || !event) {
    console.log('EventDetailModal not rendering - isOpen:', isOpen, 'event:', !!event);
    return null;
  }

  console.log('EventDetailModal rendering with event:', event);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event);
      onClose();
    }
  };

  const handleSaveEdit = (updatedEvent) => {
    onEdit(updatedEvent);
    setEditMode(false);
    onClose();
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
        darkMode 
          ? "bg-slate-800 border border-slate-700" 
          : "bg-white border border-gray-200"
      }`}>
        {!editMode ? (
          <>
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? "border-slate-700" : "border-gray-200"
            }`}>
              <div className="flex items-center space-x-3">
                <FiType className={`w-5 h-5 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`} />
                <h2 className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  Event Details
                </h2>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? "text-gray-400 hover:text-white hover:bg-slate-700" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title and Category */}
              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-3 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  {event.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  categoryColors[event.category] || categoryColors.Other
                }`}>
                  {event.category}
                </span>
              </div>

              {/* Description */}
              {event.description && (
                <div className="mb-6">
                  <h4 className={`text-lg font-semibold mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Description
                  </h4>
                  <p className={`${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {event.description}
                  </p>
                </div>
              )}

              {/* Date and Time */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <FiCalendar className={`w-5 h-5 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Date
                    </p>
                    <p className={`${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {formatDate(event.start)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FiClock className={`w-5 h-5 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Time
                    </p>
                    <p className={`${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={handleEdit}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    darkMode 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span>Edit Event</span>
                </button>
                <button
                  onClick={handleDelete}
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
            </div>
          </>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                Edit Event
              </h2>
              <button
                onClick={handleCancelEdit}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? "text-gray-400 hover:text-white hover:bg-slate-700" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <EditEventForm 
              event={event} 
              onSave={handleSaveEdit} 
              onCancel={handleCancelEdit} 
              darkMode={darkMode}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetailModal; 