// components/settings/Settings.jsx
import React, { useState, useEffect } from "react";
import SidebarNav from "./SidebarNav";
import SaveStatusNotification from "./SaveStatusNotification";
import SettingsHeader from "./SettingsHeader";
import ProfileTab from "./ProfileTab";
import AcademicTab from "./AcademicTab";
import NotificationsTab from "./NotificationsTab";
import AppearanceTab from "./AppearanceTab";
import SecurityTab from "./SecurityTab";

const Settings = ({ darkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const getUserData = () => {
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setProfile({
            name: getUserDisplayName(parsedUser),
            email: parsedUser.email || "",
            firstName: parsedUser.firstName || "",
            lastName: parsedUser.lastName || "",
          });
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    };

    getUserData();
    const handleStorageChange = (e) => {
      if (e.key === "authToken" || e.key === "user") getUserData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getUserDisplayName = (userData) => {
    if (!userData) return "User";
    if (userData.firstName && userData.lastName) return `${userData.firstName} ${userData.lastName}`;
    if (userData.firstName) return userData.firstName;
    if (userData.lastName) return userData.lastName;
    if (userData.name) return userData.name;
    if (userData.email) return userData.email.split("@")[0];
    return "User";
  };

  const showSaveStatus = (type, message) => {
    setSaveStatus({ type, message });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
            darkMode ? "bg-blue-500" : "bg-blue-200"
          }`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
            darkMode ? "bg-purple-500" : "bg-purple-200"
          }`}
        />
      </div>

      {saveStatus && <SaveStatusNotification saveStatus={saveStatus} darkMode={darkMode} />}

      <div className="relative z-10 flex max-w-7xl mx-auto">
        <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />

        <main className="flex-1 py-8 px-6 lg:px-8">
          <div
            className={`max-w-4xl mx-auto backdrop-blur-xl rounded-3xl border shadow-2xl transition-all duration-500 ${
              darkMode
                ? "bg-slate-800/40 border-slate-700/30"
                : "bg-white/60 border-gray-200/30"
            }`}
          >
            <SettingsHeader activeTab={activeTab} darkMode={darkMode} />
            <div className="p-8">
              {activeTab === "profile" && (
                <ProfileTab
                  profile={profile}
                  setProfile={setProfile}
                  user={user}
                  profileImage={profileImage}
                  setProfileImage={setProfileImage}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  handleSaveStatus={showSaveStatus}
                  darkMode={darkMode}
                />
              )}
              {activeTab === "academic" && <AcademicTab darkMode={darkMode} />}
              {activeTab === "notifications" && (
                <NotificationsTab
                  darkMode={darkMode}
                  notifEmail={notifEmail}
                  setNotifEmail={setNotifEmail}
                  notifPush={notifPush}
                  setNotifPush={setNotifPush}
                />
              )}
              {activeTab === "appearance" && (
                <AppearanceTab darkMode={darkMode} setDarkMode={setDarkMode} />
              )}
              {activeTab === "security" && (
                <SecurityTab
                  darkMode={darkMode}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  twoFactorEnabled={twoFactorEnabled}
                  setTwoFactorEnabled={setTwoFactorEnabled}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
