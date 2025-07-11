import React, { useState, useEffect } from "react";
import {
  AiOutlineUser,
  AiOutlineLock,
  AiOutlineBell,
  AiOutlineCheck,
} from "react-icons/ai";
import { MdDarkMode, MdOutlineAccountCircle } from "react-icons/md";

const navItems = [
  { key: "profile", label: "Profile", icon: <AiOutlineUser size={20} /> },
  { key: "academic", label: "Academic Info", icon: <MdOutlineAccountCircle size={20} /> },
  { key: "notifications", label: "Notifications", icon: <AiOutlineBell size={20} /> },
  { key: "appearance", label: "Appearance", icon: <MdDarkMode size={20} /> },
  { key: "security", label: "Security", icon: <AiOutlineLock size={20} /> },
];

const Toggle = ({ checked, onChange, darkMode }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      darkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'
    } ${
      checked 
        ? 'bg-blue-600' 
        : darkMode 
          ? 'bg-gray-600' 
          : 'bg-gray-200'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const Settings = ({ darkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  // Check for user authentication on component mount
  useEffect(() => {
    const getUserData = () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Set profile data from user data
          setProfile({
            name: getUserDisplayName(parsedUser),
            email: parsedUser.email || "",
            firstName: parsedUser.firstName || "",
            lastName: parsedUser.lastName || "",
          });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    };

    getUserData();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'user') {
        getUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getUserDisplayName = (userData) => {
    if (!userData) return 'User';
    if (userData.firstName && userData.lastName) return `${userData.firstName} ${userData.lastName}`;
    if (userData.firstName) return userData.firstName;
    if (userData.lastName) return userData.lastName;
    if (userData.name) return userData.name;
    if (userData.email) return userData.email.split('@')[0];
    return 'User';
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      // You can add a toast/alert here
      console.error('First name and last name are required');
      return;
    }
  
    try {
      // Get auth token
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token || !user) {
        console.error('No authentication token found');
        return;
      }
  
      // Prepare update data (only firstName and lastName)
      const updateData = {
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim()
      };
  
      // Make API call to update profile
      const response = await fetch(`/api/auth/profile/${user.id || user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
  
      const data = await response.json();
      
      if (data.success) {
        // Update user data in localStorage/sessionStorage
        const updatedUser = {
          ...user,
          firstName: profile.firstName.trim(),
          lastName: profile.lastName.trim()
        };
  
        // Update in both localStorage and sessionStorage
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        if (sessionStorage.getItem('user')) {
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
  
        // Update local state
        setUser(updatedUser);
        
        // Update profile state to reflect the new display name
        setProfile(prev => ({
          ...prev,
          name: `${profile.firstName} ${profile.lastName}` // Update display name
        }));
  
        setEditMode(false);
        
        // You can add a success toast/alert here
        console.log('Profile updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // You can add an error toast/alert here
      alert('Failed to update profile. Please try again.');
    }
  };

  const inputClass = `w-full px-4 py-3 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    darkMode 
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  const buttonClass = `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
    darkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'
  }`;

  const primaryButtonClass = `${buttonClass} bg-blue-600 text-white hover:bg-blue-700 shadow-sm`;
  const secondaryButtonClass = `${buttonClass} ${
    darkMode 
      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
  }`;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className={`hidden md:flex flex-col w-64 min-h-screen border-r ${
          darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
        } py-8 px-6`}>
          <div className="mb-8">
            <h1 className={`text-2xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Settings</h1>
            <p className={`text-sm mt-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Manage your account preferences</p>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.key
                    ? darkMode
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : darkMode
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
        <main className="flex-1 py-8 px-6">
          <div className={`max-w-2xl mx-auto rounded-xl border ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-sm`}>
            
            {/* Header */}
            <div className={`px-6 py-4 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-lg font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {navItems.find((i) => i.key === activeTab)?.label}
              </h2>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Profile */}
{activeTab === "profile" && (
  <div className="space-y-6">
    <div className="flex flex-col items-center gap-4">
      {profileImage ? (
        <img
          src={URL.createObjectURL(profileImage)}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
        />
      ) : (
        <div className={`w-20 h-20 flex items-center justify-center rounded-full text-2xl ${
          darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
        }`}>
          <AiOutlineUser size={32} />
        </div>
      )}

      {editMode && (
        <label className={`${primaryButtonClass} cursor-pointer`}>
          Change Photo
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
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>First Name</label>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>{profile.firstName || 'Not set'}</p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Last Name</label>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>{profile.lastName || 'Not set'}</p>
          </div>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Email</label>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{profile.email || 'Not set'}</p>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            className={primaryButtonClass}
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>
    ) : (
      <form onSubmit={handleProfileSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>First Name</label>
            <input
              type="text"
              className={inputClass}
              value={profile.firstName}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, firstName: e.target.value }))
              }
              placeholder="Enter first name"
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Last Name</label>
            <input
              type="text"
              className={inputClass}
              value={profile.lastName}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, lastName: e.target.value }))
              }
              placeholder="Enter last name"
              required
            />
          </div>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Email</label>
          <input
            type="email"
            className={`${inputClass} ${
              darkMode ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-100 cursor-not-allowed'
            }`}
            value={profile.email}
            disabled
            placeholder="Email cannot be changed"
          />
          <p className={`text-xs mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Email address cannot be modified for security reasons
          </p>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className={primaryButtonClass}>
            Save Changes
          </button>
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    )}
  </div>
)}

              {/* Academic Info */}
              {activeTab === "academic" && (
                <form className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Institute Name</label>
                    <input type="text" className={inputClass} placeholder="Enter your institute name" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Branch</label>
                    <input type="text" className={inputClass} placeholder="Enter your branch" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>URN Number</label>
                    <input type="text" className={inputClass} placeholder="Enter your URN number" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Current Year</label>
                      <select className={inputClass}>
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Current Semester</label>
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
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Grading System</label>
                    <select className={inputClass}>
                      <option>CGPA</option>
                      <option>GPA</option>
                      <option>Percentage</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className={primaryButtonClass}>
                      Save Academic Info
                    </button>
                  </div>
                </form>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className={`text-sm font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Email Notifications</h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Receive notifications via email</p>
                    </div>
                    <Toggle
                      checked={notifEmail}
                      onChange={() => setNotifEmail(!notifEmail)}
                      darkMode={darkMode}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className={`text-sm font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Push Notifications</h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Receive push notifications in your browser</p>
                    </div>
                    <Toggle
                      checked={notifPush}
                      onChange={() => setNotifPush(!notifPush)}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
              )}

              {/* Appearance */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className={`text-sm font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Dark Mode</h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Toggle between light and dark themes</p>
                    </div>
                    <Toggle
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>Change Password</h3>
                    <form className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Current Password</label>
                        <input type="password" className={inputClass} />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>New Password</label>
                        <input type="password" className={inputClass} />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Confirm New Password</label>
                        <input type="password" className={inputClass} />
                      </div>
                      <button className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200">
                        Update Password
                      </button>
                    </form>
                  </div>

                  <div className={`border-t pt-6 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between py-2 mb-4">
                      <div>
                        <h3 className={`text-sm font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>Two-Factor Authentication</h3>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Add an extra layer of security to your account</p>
                      </div>
                      <Toggle
                        checked={twoFactorEnabled}
                        onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        darkMode={darkMode}
                      />
                    </div>

                    {twoFactorEnabled && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Backup Email</label>
                          <input type="email" className={inputClass} placeholder="backup@example.com" />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Security Question</label>
                          <select className={inputClass}>
                            <option>What is your first school name?</option>
                            <option>What was your childhood nickname?</option>
                            <option>What is your favorite teacher's name?</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Answer</label>
                          <input type="text" className={inputClass} placeholder="Your answer" />
                        </div>
                        <button className={primaryButtonClass}>
                          Save Security Settings
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;