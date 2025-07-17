// components/settings/NotificationsTab.jsx
import React from "react";
import { Mail, Smartphone, Save } from "lucide-react";
import Toggle from "./Toggle";

const NotificationsTab = ({ darkMode, notifEmail, setNotifEmail, notifPush, setNotifPush }) => {
  const cardClass = `p-6 rounded-2xl border ${
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
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <Mail className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Email Notifications
              </h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Receive important updates and reminders via email
              </p>
              <div className={`mt-2 text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                • Assignment deadlines • Exam schedules • Grade updates
              </div>
            </div>
          </div>
          <Toggle checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} darkMode={darkMode} />
        </div>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <Smartphone className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Push Notifications
              </h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Get instant notifications in your browser
              </p>
              <div className={`mt-2 text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                • Real-time alerts • Calendar reminders • System updates
              </div>
            </div>
          </div>
          <Toggle checked={notifPush} onChange={() => setNotifPush(!notifPush)} darkMode={darkMode} />
        </div>
      </div>

      <div className={`pt-6 border-t ${darkMode ? 'border-slate-700/30' : 'border-gray-200/30'}`}>
        <button className={primaryButtonClass}>
          <span className="relative z-10 flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Notification Preferences</span>
          </span>
          <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default NotificationsTab;
