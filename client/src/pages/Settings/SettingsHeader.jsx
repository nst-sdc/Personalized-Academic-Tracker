// components/settings/SettingsHeader.jsx
import React from "react";
import { User, GraduationCap, Bell, Moon, Shield } from "lucide-react";

const navItems = {
  profile: { label: "Profile", description: "Personal information and photo", icon: User },
  academic: { label: "Academic Info", description: "Educational details and records", icon: GraduationCap },
  notifications: { label: "Notifications", description: "Communication preferences", icon: Bell },
  appearance: { label: "Appearance", description: "Theme and display settings", icon: Moon },
  security: { label: "Security", description: "Password and authentication", icon: Shield },
};

const SettingsHeader = ({ activeTab, darkMode }) => {
  const current = navItems[activeTab];
  if (!current) return null;
  const Icon = current.icon;

  return (
    <div
      className={`px-8 py-6 border-b transition-all duration-300 ${
        darkMode ? "border-slate-700/30" : "border-gray-200/30"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-2xl ${darkMode ? "bg-blue-500/20" : "bg-blue-100"}`}>
          <Icon className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
        </div>
        <div>
          <h2
            className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              darkMode
                ? "from-white via-gray-200 to-gray-300"
                : "from-gray-900 via-gray-800 to-gray-700"
            }`}
          >
            {current.label}
          </h2>
          <p className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
            {current.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;
