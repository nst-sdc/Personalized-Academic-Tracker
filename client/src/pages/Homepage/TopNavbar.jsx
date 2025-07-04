import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaUserCircle, FaSun, FaMoon, FaSignOutAlt, FaUserCog, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function TopNavbar({ darkMode, setDarkMode }) {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
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

  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <header className={`sticky top-0 z-40 w-full flex items-center justify-between px-6 py-3 shadow-sm border-b transition-colors duration-300 ${darkMode ? "bg-[#18181b] border-gray-800" : "bg-white border-gray-200"}`}>
      {/* Search Bar */}
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm ${darkMode ? "bg-[#23232a]" : "bg-gray-100"}`} style={{ minWidth: 220 }}>
        <FiSearch className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
        <input
          type="text"
          placeholder="Search..."
          className={`bg-transparent outline-none text-sm w-full ${darkMode ? "text-white placeholder:text-gray-400" : "text-gray-700 placeholder:text-gray-500"}`}
        />
      </div>

      {/* Right Section: Theme, Notifications, User/Auth */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(prev => !prev)}
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`relative w-11 h-11 flex items-center justify-center rounded-full shadow-md border transition duration-300 group
            ${darkMode ? "bg-[#23232a] border-gray-700 hover:bg-gray-800" : "bg-white border-gray-200 hover:bg-gray-100"}`}
        >
          <span className="sr-only">Toggle Theme</span>
          {darkMode ? (
            <FaSun className="w-6 h-6 text-yellow-300 group-hover:scale-110 transition-transform" />
          ) : (
            <FaMoon className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Notifications */}
        {user && (
          <div className="relative group">
            <button
              className={`w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200 shadow-md border ${darkMode ? "bg-[#23232a] border-gray-700 hover:bg-gray-800" : "bg-white border-gray-200 hover:bg-gray-100"}`}
              title="Pending Invites"
            >
              <IoMdNotificationsOutline className="w-6 h-6 text-blue-500" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#23232a]" />
            </button>
            <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-900 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">2 pending invites</span>
          </div>
        )}

        {/* User Profile or Auth Buttons */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none"
              onClick={handleProfileClick}
              title="Account Menu"
            >
              <FaUserCircle className="w-7 h-7" />
              <span className="hidden sm:block max-w-[120px] truncate text-sm font-medium">{getUserDisplayName()}</span>
            </button>
            {/* Dropdown */}
            {showDropdown && (
              <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl border z-50 ${darkMode ? "bg-[#23232a] border-gray-700 text-white" : "bg-white border-gray-200 text-black"}`}>
                <div className="py-2">
                  <div className={`px-4 py-2 border-b flex items-center gap-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <FaUser className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium truncate">{getUserDisplayName()}</span>
                  </div>
                  <button
                    onClick={() => { setShowDropdown(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FaUserCog className="w-4 h-4 text-indigo-500" />
                    View Profile
                  </button>
                  <button
                    onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FaUserCog className="w-4 h-4 text-indigo-500" />
                    Settings
                  </button>
                  <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"} mt-2`} />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/signin")}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-md hover:from-green-500 hover:to-blue-600 transition-all duration-200 text-sm"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default TopNavbar;