import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiBell, FiMoon, FiSun } from "react-icons/fi";
import { FaUserCircle, FaSignOutAlt, FaUserCog, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SearchDropdown from "./SearchDropdown";
import EventDetailModal from "./EventDetailModal";
import NotificationPanel from "./NotificationPanel";
import api from "../../utils/api";

function TopNavbar({ darkMode, setDarkMode, events, refreshEvents }) {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [searchUpdateKey, setSearchUpdateKey] = useState(0);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const modalStateRef = useRef({ selectedEvent: null, showEventModal: false });
  const navigate = useNavigate();

  // Check for user authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
        const tokenExpiry = localStorage.getItem('tokenExpiry') || sessionStorage.getItem('tokenExpiry');
        if (token && userData) {
          if (tokenExpiry && new Date() > new Date(tokenExpiry)) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiry');
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('tokenExpiry');
            setUser(null);
            return;
          }
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch notification count when user is authenticated
  useEffect(() => {
    if (user) {
      fetchNotificationCount();
    }
  }, [user]);

  const fetchNotificationCount = async () => {
    try {
      const today = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);
      
      const response = await api.get('/api/events', {
        params: {
          start: today.toISOString(),
          end: threeDaysFromNow.toISOString()
        }
      });
      
      if (response.data.success) {
        const upcomingEvents = response.data.data || [];
        const count = upcomingEvents.filter(event => {
          const eventDate = new Date(event.start || event.date);
          const timeDiff = eventDate - today;
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          return daysDiff >= 0 && daysDiff <= 3;
        }).length;
        
        // Show toast if count increased (new reminder)
        if (count > notificationCount && notificationCount > 0) {
          setShowNotificationToast(true);
          setTimeout(() => setShowNotificationToast(false), 3000);
        }
        
        setNotificationCount(count);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  // Log events when they change
  useEffect(() => {
    console.log('TopNavbar received events:', events?.length || 0);
    if (events && events.length > 0) {
      console.log('Sample event:', events[0]);
    }
  }, [events]);

  // Monitor modal state changes
  useEffect(() => {
    console.log('Modal state changed:', { selectedEvent, showEventModal });
  }, [selectedEvent, showEventModal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      
      // Close notification panel when clicking outside
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationPanel(false);
      }
      
      // Close search dropdown when clicking outside, but not when clicking on search results
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        // Check if the click is on a search result element
        const searchResultElement = event.target.closest('[data-search-result]');
        console.log('Click outside handler - searchResultElement:', !!searchResultElement);
        if (!searchResultElement) {
          console.log('Closing search dropdown due to click outside');
          setShowSearchDropdown(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchValue.trim() === '') {
      setSearchResults([]);
      setShowSearchDropdown(false);
      setHasSearchError(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch();
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue]);

  const performSearch = async () => {
    if (!searchValue.trim() || !user) {
      console.log('Search skipped - no query or user:', { searchValue: searchValue.trim(), user: !!user });
      setSearchResults([]);
      setShowSearchDropdown(false);
      setHasSearchError(false);
      return;
    }

    setIsSearching(true);
    setHasSearchError(false);
    setLastSearchQuery(searchValue.trim()); // Save the search query
    
    try {
      console.log('Performing search for:', searchValue.trim());
      console.log('User authenticated:', !!user);
      console.log('API URL:', api.defaults.baseURL);
      console.log('Available events:', events?.length || 0);
      
      // First try API search
      const response = await api.get(`/api/events/search?q=${encodeURIComponent(searchValue.trim())}`);
      console.log('Search response:', response.data);
      
      if (response.data.success) {
        setSearchResults(response.data.data || []);
        setShowSearchDropdown(true);
        console.log('Search results:', response.data.data?.length || 0, 'events found');
      } else {
        console.error('Search failed:', response.data.message);
        // Fallback to client-side search
        performClientSideSearch();
      }
    } catch (error) {
      console.error('Search error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      // Fallback to client-side search if API fails
      console.log('Falling back to client-side search...');
      performClientSideSearch();
    } finally {
      setIsSearching(false);
    }
  };

  const performClientSideSearch = () => {
    if (!events || events.length === 0) {
      console.log('No events available for client-side search');
      setSearchResults([]);
      setShowSearchDropdown(true);
      setHasSearchError(false);
      return;
    }

    const searchTerm = searchValue.trim().toLowerCase();
    console.log('Performing client-side search for:', searchTerm);
    console.log('Available events for search:', events.length);

    // Log a few sample events to verify structure
    console.log('Sample events:', events.slice(0, 3).map(e => ({
      id: e._id || e.id,
      title: e.title,
      description: e.description,
      category: e.category
    })));

    const filteredEvents = events.filter(event => {
      if (!event) return false;
      
      const title = (event.title || '').toLowerCase();
      const description = (event.description || '').toLowerCase();
      const category = (event.category || '').toLowerCase();
      
      const matches = title.includes(searchTerm) || 
                     description.includes(searchTerm) || 
                     category.includes(searchTerm);
      
      if (matches) {
        console.log('Found matching event:', event.title);
      }
      
      return matches;
    });

    console.log('Client-side search results:', filteredEvents.length, 'events found');
    setSearchResults(filteredEvents);
    setShowSearchDropdown(true);
    setHasSearchError(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      performSearch();
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.trim() === '') {
      setShowSearchDropdown(false);
      setHasSearchError(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('tokenExpiry');
    setUser(null);
    setShowDropdown(false);
    navigate('/signin');
  };

  const handleProfileClick = () => {
    if (user) setShowDropdown(prev => !prev);
  };

  const handleNotificationClick = () => {
    setShowNotificationPanel(prev => !prev);
    setShowDropdown(false); // Close user dropdown if open
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  const handleEditEvent = (event) => {
    // Show event detail modal for editing
    setSelectedEvent(event);
    setShowEventModal(true);
    setShowSearchDropdown(false);
    setSearchValue("");
  };

  const handleDeleteEvent = async (event) => {
    try {
      const eventId = event._id || event.id;
      await api.delete(`/api/events/${eventId}`);
      // Update local events state if needed
      setSearchResults(prev => prev.filter(e => (e._id || e.id) !== eventId));
      setShowEventModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Delete event error:', error);
    }
  };

  const handleEventClick = (event) => {
    console.log('TopNavbar handleEventClick called with event:', event);
    console.log('Current state before setting:', { selectedEvent, showEventModal });
    
    // Validate event object
    if (!event || !event.title) {
      console.error('Invalid event object:', event);
      return;
    }
    
    console.log('Event validation passed:', {
      id: event._id || event.id,
      title: event.title,
      category: event.category,
      start: event.start,
      end: event.end
    });
    
    // Show event detail modal
    setSelectedEvent(event);
    setShowEventModal(true);
    setShowSearchDropdown(false);
    setSearchValue("");
    
    // Update ref for debugging
    modalStateRef.current = { selectedEvent: event, showEventModal: true };
    
    // Force immediate state update
    setTimeout(() => {
      setSelectedEvent(event);
      setShowEventModal(true);
      modalStateRef.current = { selectedEvent: event, showEventModal: true };
    }, 0);
    
    console.log('Modal state set - selectedEvent:', event, 'showEventModal:', true);
    
    // Force a re-render check
    setTimeout(() => {
      console.log('State after timeout:', { selectedEvent, showEventModal });
    }, 100);
    
    // Add immediate state check
    console.log('Immediate state check - selectedEvent:', event, 'showEventModal:', true);
  };

  const handleEventEdit = async (updatedEvent) => {
    try {
      const eventId = updatedEvent._id || updatedEvent.id;
      console.log('Starting event update for ID:', eventId);
      console.log('Updated event data:', updatedEvent);
      
      const response = await api.put(`/api/events/${eventId}`, updatedEvent);
      console.log('API response:', response.data);
      
      console.log('Event updated successfully, refreshing search results...');
      console.log('Current search value:', searchValue);
      console.log('Current search results before update:', searchResults);
      
      // Always re-perform search after editing to show updated results
      if (lastSearchQuery) {
        console.log('Re-performing search with last query:', lastSearchQuery);
        try {
          const searchResponse = await api.get(`/api/events/search?q=${encodeURIComponent(lastSearchQuery)}`);
          console.log('Search API response:', searchResponse.data);
          
          if (searchResponse.data.success) {
            console.log('Setting new search results:', searchResponse.data.data);
            setSearchResults(searchResponse.data.data || []);
            setShowSearchDropdown(true);
            setSearchValue(lastSearchQuery); // Restore search value
            console.log('Search results refreshed:', searchResponse.data.data?.length || 0, 'events');
          }
        } catch (searchError) {
          console.error('Error refreshing search results:', searchError);
        }
      }
      
      console.log('Event updated successfully');
      // Refresh main event list and notification count
      if (refreshEvents) await refreshEvents();
      fetchNotificationCount();
    } catch (error) {
      console.error('Update event error:', error);
    }
  };

  const handleEventDelete = async (event) => {
    try {
      const eventId = event._id || event.id;
      await api.delete(`/api/events/${eventId}`);
      
      // Update search results
      setSearchResults(prev => prev.filter(e => (e._id || e.id) !== eventId));
      
      console.log('Event deleted successfully');
      // Refresh main event list and notification count
      if (refreshEvents) await refreshEvents();
      fetchNotificationCount();
    } catch (error) {
      console.error('Delete event error:', error);
    }
  };

  const handleCloseSearch = () => {
    setShowSearchDropdown(false);
    setSearchValue("");
    setSearchResults([]);
    setHasSearchError(false);
  };

  const handleCloseNotification = () => {
    setShowNotificationPanel(false);
    // Refresh notification count after closing
    fetchNotificationCount();
  };

  return (
    <>
      <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-all duration-300 ${
        darkMode 
          ? "bg-slate-900/95 border-slate-700/50" 
          : "bg-white/95 border-gray-200/50"
      }`}>
        <div className="flex items-center justify-between h-16 px-6">
          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className={`relative flex items-center rounded-2xl transition-all duration-200 ${
                darkMode 
                  ? "bg-slate-800/50 border border-slate-700/50" 
                  : "bg-gray-50 border border-gray-200/50"
              }`}>
                <FiSearch className={`absolute left-4 w-5 h-5 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search events, tasks, or notes..."
                  value={searchValue}
                  onChange={handleSearchInputChange}
                  className={`w-full pl-12 pr-4 py-3 bg-transparent rounded-2xl outline-none transition-all duration-200 ${
                    darkMode 
                      ? "text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20" 
                      : "text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
                {isSearching && (
                  <div className="absolute right-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  </div>
                )}
              </div>
            </form>
            
            {/* Debug SearchDropdown props */}
            {console.log('TopNavbar: Passing onEventClick to SearchDropdown:', !!handleEventClick)}
            
            {/* Search Dropdown */}
            <SearchDropdown
              key={`search-${searchUpdateKey}`}
              isOpen={showSearchDropdown}
              searchResults={searchResults}
              searchQuery={searchValue}
              darkMode={darkMode}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onEventClick={handleEventClick}
              onClose={handleCloseSearch}
              isSearching={isSearching}
              hasError={hasSearchError}
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className={`p-3 rounded-2xl transition-all duration-200 ${
                darkMode 
                  ? "bg-slate-800/50 text-yellow-400 hover:bg-slate-700/50" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            {user && (
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={handleNotificationClick}
                  className={`relative p-3 rounded-2xl transition-all duration-200 ${
                    darkMode 
                      ? "bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 hover:text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <FiBell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Panel */}
                <NotificationPanel
                  isOpen={showNotificationPanel}
                  onClose={handleCloseNotification}
                  darkMode={darkMode}
                />
              </div>
            )}

            {/* User Profile or Auth Buttons */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleProfileClick}
                  className={`flex items-center space-x-3 p-2 rounded-2xl transition-all duration-200 ${
                    darkMode 
                      ? "bg-slate-800/50 hover:bg-slate-700/50" 
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <FaUserCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-medium text-sm max-w-[120px] truncate ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    {getUserDisplayName()}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className={`absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 ${
                    darkMode 
                      ? "bg-slate-800/95 border-slate-700/50" 
                      : "bg-white/95 border-gray-200/50"
                  }`}>
                    <div className="p-4 border-b border-gray-200/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                          <FaUser className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            {getUserDisplayName()}
                          </p>
                          <p className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button
                        onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          darkMode 
                            ? "text-gray-300 hover:bg-slate-700/50 hover:text-white" 
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <FaUserCog className="w-5 h-5" />
                        <span>Profile Settings</span>
                      </button>
                      
                      {/* <button
                        onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          darkMode 
                            ? "text-gray-300 hover:bg-slate-700/50 hover:text-white" 
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <FaUserCog className="w-5 h-5" />
                        <span>Preferences</span>
                      </button> */}
                      
                      {/* <hr className="my-2 border-gray-200/20" /> */}
                      
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          darkMode 
                            ? "text-red-400 hover:bg-red-500/10" 
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <FaSignOutAlt className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/signin")}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                    darkMode 
                      ? "text-white hover:bg-slate-800/50" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {showNotificationToast && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 ${
          darkMode 
            ? "bg-slate-800/95 border-slate-700/50" 
            : "bg-white/95 border-gray-200/50"
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FiBell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`font-semibold text-sm ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                New Reminder
              </p>
              <p className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                You have upcoming events
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={showEventModal}
        onClose={() => {
          console.log('Modal closing, re-opening search dropdown...');
          setShowEventModal(false);
          setSelectedEvent(null);
          
          // Re-open search dropdown and re-perform search
          if (lastSearchQuery) {
            console.log('Re-performing search after modal close with query:', lastSearchQuery);
            setShowSearchDropdown(true);
            setSearchValue(lastSearchQuery);
            setTimeout(() => {
              performSearch();
            }, 100);
          }
        }}
        darkMode={darkMode}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
      />
    </>
  );
}

export default TopNavbar;