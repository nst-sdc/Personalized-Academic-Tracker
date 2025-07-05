import React, { useState } from "react";
import {AiOutlineUser,AiOutlineLock,AiOutlineBell,} from "react-icons/ai";
import { MdDarkMode, MdOutlineAccountCircle } from "react-icons/md";

const navItems = [
  { key: "profile", label: "Profile", icon: <AiOutlineUser size={22} /> },
  { key: "academic", label: "Academic Info", icon: <MdOutlineAccountCircle size={22} /> },
  { key: "notifications", label: "Notifications", icon: <AiOutlineBell size={22} /> },
  { key: "appearance", label: "Appearance", icon: <MdDarkMode size={22} /> },
  { key: "security", label: "Security", icon: <AiOutlineLock size={22} /> },
];

const Settings = ({ darkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "Full Name",
    email: "Email",
  });

  const inputClass =
    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div
      className={`flex min-h-screen w-full ${
        darkMode ? "bg-[#18181b] text-white" : "bg-gray-50 text-black"
      } transition-colors duration-300`}
    >
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col w-64 h-full border-r ${
          darkMode ? "border-gray-800 bg-[#101014]" : "border-gray-200 bg-white"
        } shadow-lg py-10 px-4`}
      >
        <h2 className="text-2xl font-bold mb-10 tracking-tight">Settings</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-lg transition-all duration-200
                ${
                  activeTab === item.key
                    ? darkMode
                      ? "bg-blue-900/30 text-blue-400 shadow"
                      : "bg-blue-50 text-blue-600 shadow"
                    : darkMode
                    ? "hover:bg-gray-800/50 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-12">
        <div
          className={`w-full max-w-2xl rounded-2xl shadow-xl p-8 ${
            darkMode ? "bg-[#23232a]" : "bg-white"
          } transition-colors duration-300`}
        >
          <h3 className="text-xl font-semibold mb-6 capitalize">
            {navItems.find((i) => i.key === activeTab).label}
          </h3>

          {/* Profile */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                {profileImage ? (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover shadow-md border"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 shadow-md text-4xl">
                    📷
                  </div>
                )}

                {editMode && (
                  <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition">
                    Upload Profile Picture
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setProfileImage(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {!editMode ? (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEditMode(false); 
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block mb-1">Full Name</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Email</label>
                    <input
                      type="email"
                      className={inputClass}
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Academic Info */}
          {activeTab === "academic" && (
            <form className="space-y-4">
              <div>
                <label className="block mb-1">Institute Name</label>
                <input type="text" className={inputClass} placeholder="Enter your institue name" />
              </div>
              <div>
                <label className="block mb-1">Branch</label>
                <input type="text" className={inputClass} placeholder="Enter your branch" />
              </div>
              <div>
                <label className="block mb-1">URN Number</label>
                <input type="text" className={inputClass} placeholder="Enter your URN number" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Current Year</label>
                  <select className={inputClass}>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Current Semester</label>
                  <select className={inputClass}>
                    <option>Semester 1</option>
                    <option>Semester 2</option>
                    <option>Semester 3</option>
                    <option>Semester 4</option>
                    <option>Semester 5</option>
                    <option>Semester 6</option>
                    <option>Semester 7</option>
                    <option>Semester 8</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block mb-1">Grading System</label>
                <select className={inputClass}>
                  <option>CGPA</option>
                  <option>GPA</option>
                  <option>Percentage</option>
                </select>
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Save Academic Info
              </button>
            </form>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Email Notifications</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={notifEmail}
                  onChange={() => setNotifEmail(!notifEmail)}
                />
              </div>
              <div className="flex justify-between items-center">
                <span>Push Notifications</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={notifPush}
                  onChange={() => setNotifPush(!notifPush)}
                />
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Choose how you'd like to receive updates.
              </p>
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Enable Dark Mode</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Toggle dark/light theme.
              </p>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <form className="space-y-4">
              <div>
                <label className="block mb-1">Current Password</label>
                <input type="password" className={inputClass} />
              </div>
              <div>
                <label className="block mb-1">New Password</label>
                <input type="password" className={inputClass} />
              </div>
              <div>
                <label className="block mb-1">Confirm New Password</label>
                <input type="password" className={inputClass} />
              </div>
              <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Change Password
              </button>

              <hr className="my-6 border-gray-300 dark:border-gray-700" />

              <div className="flex justify-between items-center">
                <span>Enable Two-Factor Authentication</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                />
              </div>

              {twoFactorEnabled && (
                <div className="space-y-4 mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Two-factor authentication adds an extra layer of security to your account.
                  </p>

                  <div>
                    <label className="block mb-1">Backup Email</label>
                    <input type="email" className={inputClass} placeholder="backup@example.com" />
                  </div>

                  <div>
                    <label className="block mb-1">Security Question</label>
                    <select className={inputClass}>
                      <option>What is your first school name?</option>
                      <option>What was your childhood nickname?</option>
                      <option>What is your favorite teacher's name?</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Answer</label>
                    <input type="text" className={inputClass} placeholder="Your Answer" />
                  </div>
                </div>
              )}

              
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;
