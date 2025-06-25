import React, { useState } from "react";
import { AiOutlineUser, AiOutlineLock, AiOutlineBell, AiOutlineSetting } from "react-icons/ai";
import { MdDarkMode, MdOutlineAccountCircle } from "react-icons/md";

const navItems = [
  { key: "profile", label: "Profile", icon: <AiOutlineUser size={22} /> },
  { key: "account", label: "Account", icon: <MdOutlineAccountCircle size={22} /> },
  { key: "notifications", label: "Notifications", icon: <AiOutlineBell size={22} /> },
  { key: "appearance", label: "Appearance", icon: <MdDarkMode size={22} /> },
  { key: "security", label: "Security", icon: <AiOutlineLock size={22} /> },
];

const Settings = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className={`flex min-h-screen w-full ${darkMode ? "bg-[#18181b] text-white" : "bg-gray-50 text-black"} transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 h-full border-r ${darkMode ? "border-gray-800 bg-[#101014]" : "border-gray-200 bg-white"} shadow-lg py-10 px-4`}>
        <h2 className="text-2xl font-bold mb-10 tracking-tight">Settings</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-lg transition-all duration-200
                ${activeTab === item.key
                  ? darkMode
                    ? "bg-blue-900/30 text-blue-400 shadow"
                    : "bg-blue-50 text-blue-600 shadow"
                  : darkMode
                  ? "hover:bg-gray-800/50 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"}
              `}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className={`w-full max-w-2xl rounded-2xl shadow-xl p-8 ${darkMode ? 'bg-[#23232a]' : 'bg-white'} transition-colors duration-300`}>
          <h3 className="text-xl font-semibold mb-6 capitalize">{navItems.find(i => i.key === activeTab).label}</h3>
          {/* Placeholder for each tab's content */}
          {activeTab === "profile" && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Update your profile information here.</p>
              {/* Add profile form fields here */}
            </div>
          )}
          {activeTab === "account" && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Manage your account settings.</p>
              {/* Add account form fields here */}
            </div>
          )}
          {activeTab === "notifications" && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Set your notification preferences.</p>
              {/* Add notification settings here */}
            </div>
          )}
          {activeTab === "appearance" && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Customize the appearance of your dashboard.</p>
              {/* Add appearance settings here */}
            </div>
          )}
          {activeTab === "security" && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Update your password and security options.</p>
              {/* Add security settings here */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings; 