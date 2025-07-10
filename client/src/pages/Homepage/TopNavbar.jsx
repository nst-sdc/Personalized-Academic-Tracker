import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiBell, FiMoon, FiSun } from "react-icons/fi";
import { FaUserCircle, FaSignOutAlt, FaUserCog, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function TopNavbar({ darkMode, setDarkMode }) {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
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
    <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-all duration-300 ${
      darkMode 
        ? "bg-slate-900/95 border-slate-700/50" 
        : "bg-white/95 border-gray-200/50"
    }`}>
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className={`relative flex items-center rounded-2xl transition-all duration-200 ${
            darkMode 
              ? "bg-slate-800/50 border border-slate-700/50" 
              : "bg-gray-50 border border-gray-200/50"
          }`}>
            <FiSearch className={`absolute left-4 w-5 h-5 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`} />
            <input
              type="text"
              placeholder="Search events, tasks, or notes..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 bg-transparent rounded-2xl outline-none transition-all duration-200 ${
                darkMode 
                  ? "text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20" 
                  : "text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20"
              }`}
            />
          </div>
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
            <button className={`relative p-3 rounded-2xl transition-all duration-200 ${
              darkMode 
                ? "bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 hover:text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}>
              <FiBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>
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
                      onClick={() => { setShowDropdown(false); navigate('/profile'); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        darkMode 
                          ? "text-gray-300 hover:bg-slate-700/50 hover:text-white" 
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <FaUserCog className="w-5 h-5" />
                      <span>Profile Settings</span>
                    </button>
                    
                    <button
                      onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        darkMode 
                          ? "text-gray-300 hover:bg-slate-700/50 hover:text-white" 
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <FaUserCog className="w-5 h-5" />
                      <span>Preferences</span>
                    </button>
                    
                    <hr className="my-2 border-gray-200/20" />
                    
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
  );
}

export default TopNavbar;