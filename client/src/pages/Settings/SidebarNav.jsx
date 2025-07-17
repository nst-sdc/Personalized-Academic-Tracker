// components/settings/SidebarNav.jsx
import React from "react";
import { Settings as SettingsIcon, User, GraduationCap, Bell, Moon, Shield } from "lucide-react";

const navItems = [
  { key: "profile", label: "Profile", icon: User, description: "Personal information and photo" },
  { key: "academic", label: "Academic Info", icon: GraduationCap, description: "Educational details and records" },
  { key: "notifications", label: "Notifications", icon: Bell, description: "Communication preferences" },
  { key: "appearance", label: "Appearance", icon: Moon, description: "Theme and display settings" },
  { key: "security", label: "Security", icon: Shield, description: "Password and authentication" },
];

const SidebarNav = ({ activeTab, setActiveTab, darkMode }) => {
  return (
    <aside className={`hidden lg:flex flex-col w-80 min-h-screen border-r backdrop-blur-xl transition-all duration-500 ${
      darkMode ? "border-slate-700/30 bg-slate-900/80" : "border-gray-200/30 bg-white/80"
    } py-8 px-6`}>
      <div className="mb-10">
        <div className="flex items-center space-x-4 mb-6">
          <div className={`p-3 rounded-2xl ${darkMode ? "bg-blue-500/20" : "bg-blue-100"}`}>
            <SettingsIcon className={`w-8 h-8 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              darkMode ? "from-white via-gray-200 to-gray-300" : "from-gray-900 via-gray-800 to-gray-700"
            }`}>
              Settings
            </h1>
            <p className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
              Manage your account preferences
            </p>
          </div>
        </div>
        <div className={`h-1 w-20 rounded-full bg-gradient-to-r ${
          darkMode ? "from-blue-400/40 to-purple-400/40" : "from-blue-500/30 to-purple-500/30"
        }`} />
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              className={`group relative w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                isActive
                  ? darkMode
                    ? "bg-slate-800/60 text-white shadow-lg border border-slate-700/50"
                    : "bg-white/80 text-gray-900 shadow-lg border border-gray-200/50"
                  : darkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent hover:border-slate-700/30"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 border border-transparent hover:border-gray-200/40"
              }`}
              onClick={() => setActiveTab(item.key)}
            >
              {isActive && (
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r opacity-10 ${
                  darkMode ? "from-blue-400 to-purple-400" : "from-blue-500 to-purple-500"
                }`} />
              )}
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? darkMode
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                  : "group-hover:scale-110"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">{item.label}</div>
                <div className={`text-xs mt-0.5 ${darkMode ? "text-slate-500" : "text-gray-500"}`}>
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${
                  darkMode ? "from-blue-400 to-purple-400" : "from-blue-500 to-purple-500"
                }`} />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarNav;
