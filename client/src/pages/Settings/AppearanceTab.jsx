// components/settings/AppearanceTab.jsx
import React from "react";
import { Sun, Moon, Save } from "lucide-react";
import Toggle from "./Toggle";

const AppearanceTab = ({ darkMode, setDarkMode }) => {
  const cardClass = `p-8 rounded-2xl border ${
    darkMode ? 'bg-slate-700/20 border-slate-600/30' : 'bg-gray-50/50 border-gray-200/50'
  }`;

  const buttonClass = `group relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] ${
    darkMode ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'
  }`;

  const primaryButtonClass = `${buttonClass} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl shadow-blue-500/25`;

  return (
    <div className="space-y-8">
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-4">
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
              {darkMode ? (
                <Moon className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              ) : (
                <Sun className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              )}
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </h3>
              <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {darkMode
                  ? 'Switch to light mode for better visibility in bright environments'
                  : 'Switch to dark mode for reduced eye strain in low-light conditions'}
              </p>
              <div className={`mt-3 text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                • Automatic theme detection • Reduced eye strain • Better battery life
              </div>
            </div>
          </div>
          <Toggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} darkMode={darkMode} />
        </div>
      </div>

      <div className={`pt-6 border-t ${darkMode ? 'border-slate-700/30' : 'border-gray-200/30'}`}>
        <button className={primaryButtonClass}>
          <span className="relative z-10 flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Appearance Settings</span>
          </span>
          <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default AppearanceTab;
