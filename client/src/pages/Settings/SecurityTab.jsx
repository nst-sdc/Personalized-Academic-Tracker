// components/settings/SecurityTab.jsx
import React from "react";
import { Lock, Shield, Eye, EyeOff, Save } from "lucide-react";
import Toggle from "./Toggle";

const SecurityTab = ({
  darkMode,
  showPassword,
  setShowPassword,
  twoFactorEnabled,
  setTwoFactorEnabled
}) => {
  const inputClass = `group relative w-full px-4 py-3.5 border rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 placeholder:transition-colors ${
    darkMode
      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 hover:bg-slate-800/70 focus:bg-slate-800/70'
      : 'bg-white/80 border-gray-200/60 text-gray-900 placeholder-gray-500 hover:bg-white focus:bg-white shadow-sm hover:shadow-md'
  }`;

  const cardClass = `p-6 rounded-2xl border ${
    darkMode ? 'bg-slate-700/20 border-slate-600/30' : 'bg-gray-50/50 border-gray-200/50'
  }`;

  const buttonClass = `group relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] ${
    darkMode ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'
  }`;

  const dangerButtonClass = `${buttonClass} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl shadow-red-500/25`;
  const primaryButtonClass = `${buttonClass} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl shadow-blue-500/25`;

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div className={cardClass}>
        <div className="flex items-center space-x-3 mb-6">
          <Lock className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Change Password
          </h3>
        </div>
        <form className="space-y-6">
          {["current", "new", "confirm"].map((field) => (
            <div key={field}>
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                {field === "current"
                  ? "Current Password"
                  : field === "new"
                  ? "New Password"
                  : "Confirm New Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword[field] ? "text" : "password"}
                  className={`${inputClass} pr-12`}
                  placeholder={
                    field === "current"
                      ? "Enter your current password"
                      : field === "new"
                      ? "Enter your new password"
                      : "Confirm your new password"
                  }
                />
                <button
                  type="button"
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                    darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))}
                >
                  {showPassword[field] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ))}
          <button className={dangerButtonClass}>
            <span className="relative z-10 flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Update Password</span>
            </span>
            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </form>
      </div>

      {/* Two-Factor Auth */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
              <Shield className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Two-Factor Authentication
              </h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Add an extra layer of security to your account
              </p>
              <div className={`mt-2 text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                • Enhanced account protection • Backup recovery options • Security alerts
              </div>
            </div>
          </div>
          <Toggle checked={twoFactorEnabled} onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} darkMode={darkMode} />
        </div>

        {twoFactorEnabled && (
          <div className="space-y-6 mt-6 pt-6 border-t border-slate-600/20">
            <div>
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Backup Email
              </label>
              <input type="email" className={inputClass} placeholder="backup@example.com" />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Security Question
              </label>
              <select className={inputClass}>
                <option value="">Choose a security question</option>
                <option value="school">What is your first school name?</option>
                <option value="nickname">What was your childhood nickname?</option>
                <option value="teacher">What is your favorite teacher's name?</option>
                <option value="pet">What was the name of your first pet?</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Security Answer
              </label>
              <input type="text" className={inputClass} placeholder="Enter your answer" />
            </div>
            <button className={primaryButtonClass}>
              <span className="relative z-10 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Save Security Settings</span>
              </span>
              <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityTab;