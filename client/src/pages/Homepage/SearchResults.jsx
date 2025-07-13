import React from "react";
import { FiX, FiCalendar, FiClock, FiMapPin, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

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
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function SearchResults({ isOpen, onClose, searchResults, searchQuery, darkMode, onEditEvent, onDeleteEvent }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleEventClick = (event) => {
    // Navigate to the event details or calendar view
    // For now, we'll navigate to the home page and highlight the event
    navigate('/', { state: { highlightEvent: event._id || event.id } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl ${
        darkMode 
          ? "bg-slate-800 border border-slate-700" 
          : "bg-white border border-gray-200"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? "border-slate-700" : "border-gray-200"
        }`}>
          <div>
            <h2 className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              Search Results
            </h2>
            <p className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Found {searchResults.length} event{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-200 ${
              darkMode 
                ? "text-gray-400 hover:text-white hover:bg-slate-700" 
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <FiCalendar className={`w-12 h-12 mx-auto mb-4 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`} />
              <p className={`text-lg font-medium ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                No events found
              </p>
              <p className={`text-sm ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}>
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((event) => (
                <div
                  key={event._id || event.id}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-lg ${
                    darkMode 
                      ? "border-slate-700 bg-slate-700/50 hover:bg-slate-600/50" 
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                          {event.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          categoryColors[event.category] || categoryColors.Other
                        }`}>
                          {event.category}
                        </span>
                      </div>
                      
                      {event.description && (
                        <p className={`text-sm mb-3 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                          {event.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <FiCalendar className={`w-4 h-4 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`} />
                          <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                            {formatDate(event.start)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiClock className={`w-4 h-4 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`} />
                          <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEvent(event);
                        }}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          darkMode 
                            ? "text-gray-400 hover:text-blue-400 hover:bg-slate-600" 
                            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                        title="Edit event"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEvent(event);
                        }}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          darkMode 
                            ? "text-gray-400 hover:text-red-400 hover:bg-slate-600" 
                            : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                        }`}
                        title="Delete event"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults; 