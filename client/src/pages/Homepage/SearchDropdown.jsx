import React from "react";
import { FiCalendar, FiClock, FiEdit2, FiTrash2 } from "react-icons/fi";
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

function SearchDropdown({ isOpen, searchResults, searchQuery, darkMode, onEditEvent, onDeleteEvent, onEventClick, onClose, isSearching, hasError }) {
  const navigate = useNavigate();

  console.log('SearchDropdown props:', { 
    isOpen, 
    searchResultsCount: searchResults?.length, 
    onEventClick: !!onEventClick 
  });
  console.log('SearchDropdown searchResults:', searchResults?.map(e => ({ id: e._id, title: e.title })));

  if (!isOpen) return null;

  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
    console.log('onEventClick function:', !!onEventClick);
    
    // Add visual feedback
    const eventElement = document.querySelector(`[data-event-id="${event._id || event.id}"]`);
    if (eventElement) {
      eventElement.style.transform = 'scale(0.95)';
      setTimeout(() => {
        eventElement.style.transform = '';
      }, 150);
    }
    
    if (onEventClick) {
      console.log('Calling onEventClick with event:', event);
      onEventClick(event);
    } else {
      console.log('No onEventClick provided, using fallback navigation');
      // Fallback to navigation
      navigate('/', { state: { highlightEvent: event._id || event.id } });
      onClose();
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50" data-search-result>
      <div className={`max-h-80 overflow-y-auto rounded-2xl shadow-2xl border backdrop-blur-xl ${
        darkMode 
          ? "bg-slate-800/95 border-slate-700/50" 
          : "bg-white/95 border-gray-200/50"
      }`}>
        <div className="p-4">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              <span className={`ml-3 text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Searching...
              </span>
            </div>
          ) : hasError ? (
            <div className="text-center py-6">
              <p className={`text-sm ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}>
                Error searching events. Please try again.
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-6">
              <p className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                No events found for "{searchQuery}"
              </p>
              <p className={`text-xs mt-1 ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}>
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <p className={`text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  Found {searchResults.length} event{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              </div>
              
              <div className="space-y-2">
                {searchResults.map((event) => (
                  <div
                    key={event._id || event.id}
                    data-event-id={event._id || event.id}
                    className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-lg ${
                      darkMode 
                        ? "border-slate-700 bg-slate-700/50 hover:bg-slate-600/50" 
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('SearchDropdown: Event clicked in map:', event);
                      console.log('SearchDropdown: onEventClick function exists:', !!onEventClick);
                      console.log('SearchDropdown: Event object keys:', Object.keys(event));
                      handleEventClick(event);
                    }}
                    onMouseDown={(e) => {
                      console.log('SearchDropdown: Mouse down on event:', event.title);
                    }}
                    onMouseUp={(e) => {
                      console.log('SearchDropdown: Mouse up on event:', event.title);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-semibold truncate ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            {event.title}
                          </h4>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                            categoryColors[event.category] || categoryColors.Other
                          }`}>
                            {event.category}
                          </span>
                        </div>
                        
                        {event.description && (
                          <p className={`text-xs mb-2 line-clamp-2 ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}>
                            {event.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-3 text-xs">
                          <div className="flex items-center space-x-1">
                            <FiCalendar className={`w-3 h-3 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`} />
                            <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                              {formatDate(event.start)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiClock className={`w-3 h-3 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`} />
                            <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                              {formatTime(event.start)} - {formatTime(event.end)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEvent(event);
                          }}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            darkMode 
                              ? "text-gray-400 hover:text-blue-400 hover:bg-slate-600" 
                              : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                          title="Edit event"
                        >
                          <FiEdit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEvent(event);
                          }}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            darkMode 
                              ? "text-gray-400 hover:text-red-400 hover:bg-slate-600" 
                              : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                          }`}
                          title="Delete event"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchDropdown; 