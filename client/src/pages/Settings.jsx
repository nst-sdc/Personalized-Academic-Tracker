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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 dark:from-[#18181b] dark:via-[#23232a] dark:to-[#18181b] transition-colors duration-300">
      {/* Glassy Card Main Panel */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100/60 via-sky-100/40 to-indigo-200/60 dark:from-[#23232a]/80 dark:via-[#18181b]/60 dark:to-[#23232a]/80 backdrop-blur-2xl" />
      <div className="relative z-10 flex w-full max-w-5xl min-h-[700px] rounded-3xl shadow-2xl overflow-hidden border border-blue-100 dark:border-gray-800 bg-white/80 dark:bg-[#23232a]/80 backdrop-blur-xl">
        {/* Sticky Sidebar */}
        <aside className="flex flex-col items-center py-10 px-2 w-20 bg-white/60 dark:bg-[#18181b]/60 border-r border-blue-100 dark:border-gray-800 shadow-lg sticky top-0 h-full z-20">
          <div className="mb-10">
            <span className="block w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg" />
          </div>
          <nav className="flex flex-col gap-6 w-full items-center">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group relative ${activeTab === item.key ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg scale-110" : "hover:bg-blue-100/60 dark:hover:bg-gray-800/60 text-gray-400 dark:text-gray-500"}`}
                onClick={() => setActiveTab(item.key)}
                title={item.label}
              >
                {item.icon}
                {activeTab === item.key && <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow" />}
              </button>
            ))}
          </nav>
        </aside>
        {/* Main Content Card */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-xl mx-auto space-y-10 animate-fade-in">
            {/* Profile Section */}
            {activeTab === "profile" && (
              <Card className="bg-white/90 dark:bg-[#23232a]/90 shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-8 mb-8">
                    <div className="relative group">
                      {profileImage ? (
                        <img src={URL.createObjectURL(profileImage)} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-gradient-to-br from-blue-400 to-indigo-500 shadow-xl" />
                      ) : (
                        <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 text-blue-500 shadow-xl text-5xl border-4 border-gradient-to-br from-blue-400 to-indigo-500">📷</div>
                      )}
                      {editMode && (
                        <label className="absolute bottom-0 right-0 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full p-2 shadow-lg cursor-pointer hover:scale-105 transition-transform">
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files && e.target.files[0]) { setProfileImage(e.target.files[0]); } }} />
                          <span className="text-xs font-semibold">Edit</span>
                        </label>
                      )}
                    </div>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); setEditMode(false); }} className="grid grid-cols-1 gap-6">
                    <div className="relative">
                      <Input type="text" value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} className="peer pt-6" required />
                      <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-blue-500 bg-white/80 dark:bg-[#23232a]/80 px-1 pointer-events-none">Full Name</label>
                    </div>
                    <div className="relative">
                      <Input type="email" value={profile.email} onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))} className="peer pt-6" required />
                      <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-blue-500 bg-white/80 dark:bg-[#23232a]/80 px-1 pointer-events-none">Email</label>
                    </div>
                    <div className="flex gap-2 justify-end sticky bottom-0 bg-white/80 dark:bg-[#23232a]/80 py-4 rounded-b-2xl">
                      {editMode ? (
                        <>
                          <Button type="button" variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
                          <Button type="submit" variant="default">Save Changes</Button>
                        </>
                      ) : (
                        <Button type="button" variant="default" onClick={() => setEditMode(true)}>Edit Profile</Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            {/* Academic Info Section */}
            {activeTab === "academic" && (
              <Card className="bg-white/90 dark:bg-[#23232a]/90 shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Academic Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="grid grid-cols-1 gap-6">
                    <div className="relative">
                      <Input type="text" placeholder=" " className="peer pt-6" required />
                      <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-blue-500 bg-white/80 dark:bg-[#23232a]/80 px-1 pointer-events-none">Institute Name</label>
                    </div>
                    <div className="relative">
                      <Input type="text" placeholder=" " className="peer pt-6" required />
                      <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-blue-500 bg-white/80 dark:bg-[#23232a]/80 px-1 pointer-events-none">Branch</label>
                    </div>
                    <div className="relative">
                      <Input type="text" placeholder=" " className="peer pt-6" required />
                      <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-blue-500 bg-white/80 dark:bg-[#23232a]/80 px-1 pointer-events-none">URN Number</label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <select className="w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent peer pt-6" required>
                          <option value="">Select Year</option>
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year</option>
                        </select>
                        <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-blue-500 bg-white/80 dark:bg-[#23232a]/80 px-1 pointer-events-none">Current Year</label>
                      </div>
                      <div className="relative">
                        <select className="w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent peer pt-6" required>
                          <option value="">Select Semester</option>
                          <option>Semester 1</option>
                          <option>Semester 2</option>
                          <option>Semester 3</option>
                          <option>Semester 4</option>
                          <option>Semester 5</option>
                          <option>Semester 6</option>
                          <option>Semester 7</option>
                          <option>Semester 8</option>
                        </select>
                        <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-blue-500 bg-white/80 dark:bg-[#23232a]/80 px-1 pointer-events-none">Current Semester</label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="reset" variant="secondary">Reset</Button>
                      <Button type="submit" variant="default">Save Academic Info</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            {/* Notifications Section */}
            {activeTab === "notifications" && (
              <Card className="bg-white/90 dark:bg-[#23232a]/90 shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Email Notifications</span>
                      <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Push Notifications</span>
                      <Switch checked={notifPush} onCheckedChange={setNotifPush} />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <Button type="reset" variant="secondary">Reset</Button>
                      <Button type="submit" variant="default">Save Notification Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Appearance Section */}
            {activeTab === "appearance" && (
              <Card className="bg-white/90 dark:bg-[#23232a]/90 shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Appearance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-medium">Dark Mode</span>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Toggle dark mode for the entire app.</p>
                  <div className="flex justify-end gap-2">
                    <Button type="reset" variant="secondary">Reset</Button>
                    <Button type="submit" variant="default">Save Appearance</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Security Section */}
            {activeTab === "security" && (
              <Card className="bg-white/90 dark:bg-[#23232a]/90 shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Two-Factor Authentication</span>
                      <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Enable two-factor authentication for extra account security.</p>
                    <div className="flex justify-end gap-2 mt-6">
                      <Button type="reset" variant="secondary">Reset</Button>
                      <Button type="submit" variant="default">Save Security Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
