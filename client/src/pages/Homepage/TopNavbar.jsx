import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function TopNavbar({ darkMode, setDarkMode }) {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const bgHeader = darkMode ? "bg-[#1A1A1A]" : "bg-[#F5F5F5]";
  const bgSearch = darkMode ? "bg-[#2A2A2A]" : "bg-[#F5F5F5]";
  const textColor = darkMode ? "text-white" : "text-black";
  const placeholderColor = darkMode ? "placeholder:text-gray-400" : "placeholder:text-gray-500";
  const pendingColor = darkMode ? "text-gray-300" : "text-gray-600";
  const profileTextColor = darkMode ? "text-gray-200" : "text-gray-800";

  // Check for user authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check both localStorage and sessionStorage for auth token
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
        const tokenExpiry = localStorage.getItem('tokenExpiry') || sessionStorage.getItem('tokenExpiry');

        if (token && userData) {
          // Check if token is expired
          if (tokenExpiry && new Date() > new Date(tokenExpiry)) {
            // Token expired, clear storage
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
        console.error('Error checking authentication:', error);
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (for logout in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear all auth data
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
    if (user) {
      setShowDropdown(prev => !prev);
    }
  };

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return '';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    } else if (user.name) {
      return user.name;
    } else if (user.email) {
      return user.email.split('@')[0]; // Use email username as fallback
    }
    return 'User';
  };

  return (
    <header className={`relative h-[118px] px-6 w-full flex items-center justify-between transition-colors duration-300 ${bgHeader}`}>
      <div className={`flex items-center gap-3 px-4 py-2 rounded transition-colors duration-300 ${bgSearch}`}>
        <FiSearch alt="search icon" className="w-6 h-6" />
        <input
          type="text"
          placeholder="Search"
          className={`bg-transparent outline-none text-sm w-full ${textColor} ${placeholderColor}`}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(prev => !prev)}
          aria-label={darkMode ? "Activate Light Mode" : "Activate Dark Mode"}
          className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md border transition duration-300
            ${darkMode ? "bg-gray-800 text-yellow-300 border-gray-700 hover:bg-gray-700" 
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-200"}
          `}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "🌙" : "☀️"}
        </button>

        {/* User Authentication Section */}
        {user ? (
          // Logged in user
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfileClick}
            >
              <FaUserCircle className="w-8 h-8 rounded-full object-cover" />
              <span className={`text-sm font-medium leading-none ${profileTextColor} max-w-32 truncate`}>
                {getUserDisplayName()}
              </span>
              <IoIosArrowDown 
                className={`w-3 h-3 mt-[1px] transition-transform duration-200 ${
                  showDropdown ? 'rotate-180' : ''
                }`} 
              />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-50 ${
                darkMode 
                  ? "bg-gray-800 border-gray-700 text-white" 
                  : "bg-white border-gray-200 text-black"
              }`}>
                <div className="py-2">
                  <div className={`px-4 py-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-opacity-80 transition-colors ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                  >
                    View Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/settings');
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-opacity-80 transition-colors ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                  >
                    Settings
                  </button>
                  
                  <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Not logged in - show login/signup buttons
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/signin")}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 ${
                darkMode 
                  ? "border-gray-600 text-gray-200 hover:bg-gray-800 hover:border-gray-500" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Notification Section - Only show when user is logged in */}
      {user && (
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-sm ${pendingColor}`}>
          <div className="relative flex items-center">
            <IoMdNotificationsOutline alt="Notification" className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <span className="leading-none">2 pending invites</span>
          <IoIosArrowDown alt="arrow" className="w-3 h-3 mt-[1px]" />
        </div>
      )}
    </header>
  );
}

export default TopNavbar;