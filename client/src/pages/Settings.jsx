import React, { useState } from "react";
import { AiOutlineUser, AiOutlineLock, AiOutlineBell } from "react-icons/ai";
import { MdDarkMode, MdOutlineAccountCircle } from "react-icons/md";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";

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
  const [profile, setProfile] = useState({ name: "Full Name", email: "Email" });

  return (
    <div className={`flex min-h-screen w-full ${darkMode ? "bg-[#18181b] text-white" : "bg-gray-50 text-black"} transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`hidden md:flex flex-col w-56 h-full border-r ${darkMode ? "border-gray-800 bg-[#101014]" : "border-gray-200 bg-white"} shadow-lg py-10 px-4 rounded-r-3xl`}>        <h2 className="text-xl font-bold mb-10 tracking-tight pl-2">Settings</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base transition-all duration-200 ${activeTab === item.key ? (darkMode ? "bg-blue-900/40 text-blue-400 shadow" : "bg-blue-50 text-blue-600 shadow") : darkMode ? "hover:bg-gray-800/50 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-2 md:px-8 py-12">
        <div className="w-full max-w-2xl space-y-8">
          {/* Profile */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-6 mb-6">
                  {profileImage ? (
                    <img src={URL.createObjectURL(profileImage)} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-md border" />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 shadow-md text-4xl">📷</div>
                  )}
                  {editMode && (
                    <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition">
                      Upload Profile Picture
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files && e.target.files[0]) { setProfileImage(e.target.files[0]); } }} />
                    </label>
                  )}
                </div>
                {!editMode ? (
                  <div className="space-y-2 text-center">
                    <p className="text-lg font-semibold">{profile.name}</p>
                    <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                    <Button className="mt-4 w-full" onClick={() => setEditMode(true)} variant="default">Edit Profile</Button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setEditMode(false); }} className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium">Full Name</label>
                      <Input type="text" value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Email</label>
                      <Input type="email" value={profile.email} onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))} />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
                      <Button type="submit" variant="default">Save Changes</Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {/* Academic Info */}
          {activeTab === "academic" && (
            <Card>
              <CardHeader>
                <CardTitle>Academic Info</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Institute Name</label>
                    <Input type="text" placeholder="Enter your institute name" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Branch</label>
                    <Input type="text" placeholder="Enter your branch" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">URN Number</label>
                    <Input type="text" placeholder="Enter your URN number" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">Current Year</label>
                      <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Current Semester</label>
                      <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
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
                  <div className="flex justify-end">
                    <Button type="submit" variant="default">Save Academic Info</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Email Notifications</span>
                    <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Push Notifications</span>
                    <Switch checked={notifPush} onCheckedChange={setNotifPush} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Dark Mode</span>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Toggle dark mode for the entire app.</p>
              </CardContent>
            </Card>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Two-Factor Authentication</span>
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Enable two-factor authentication for extra account security.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;
