import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  Check,
  Moon,
  Sun,
  UserCircle,
  Camera,
  Shield,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  X,
  Edit3,
  AlertCircle,
  CheckCircle,
  Settings as SettingsIcon,
  GraduationCap,
  Building,
  Calendar,
  Award
} from "lucide-react";

const navItems = [
  { key: "profile", label: "Profile", icon: User, description: "Personal information and photo" },
  { key: "academic", label: "Academic Info", icon: GraduationCap, description: "Educational details and records" },
  { key: "notifications", label: "Notifications", icon: Bell, description: "Communication preferences" },
  { key: "appearance", label: "Appearance", icon: Moon, description: "Theme and display settings" },
  { key: "security", label: "Security", icon: Shield, description: "Password and authentication" },
];

const Toggle = ({ checked, onChange, darkMode, disabled = false }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={`group relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 ${
      darkMode ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'
    } ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    } ${
      checked 
        ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25' 
        : darkMode 
          ? 'bg-slate-700 hover:bg-slate-600' 
          : 'bg-gray-200 hover:bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 group-hover:scale-110 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
    {checked && (
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse" />
    )}
  </button>
);

const Settings = ({ darkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [saveStatus, setSaveStatus] = useState(null);

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

  const showSaveStatus = (type, message) => {
    setSaveStatus({ type, message });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      showSaveStatus('error', 'First name and last name are required');
      return;
    }
  
    try {
      // Get auth token
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token || !user) {
        showSaveStatus('error', 'No authentication token found');
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
        showSaveStatus('success', 'Profile updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showSaveStatus('error', 'Failed to update profile. Please try again.');
    }
  };

  const inputClass = `group relative w-full px-4 py-3.5 border rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 placeholder:transition-colors ${
    darkMode 
      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 hover:bg-slate-800/70 focus:bg-slate-800/70' 
      : 'bg-white/80 border-gray-200/60 text-gray-900 placeholder-gray-500 hover:bg-white focus:bg-white shadow-sm hover:shadow-md'
  }`;

  const buttonClass = `group relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] ${
    darkMode ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'
  }`;

  const primaryButtonClass = `${buttonClass} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl shadow-blue-500/25`;
  const secondaryButtonClass = `${buttonClass} ${
    darkMode 
      ? 'bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white border border-slate-600/50 hover:border-slate-500/50' 
      : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900 border border-gray-200/60 hover:border-gray-300/60 shadow-sm hover:shadow-md'
  }`;

  const dangerButtonClass = `${buttonClass} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl shadow-red-500/25`;

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-blue-500' : 'bg-blue-200'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-purple-500' : 'bg-purple-200'
        }`} />
      </div>

      {/* Save Status Notification */}
      {saveStatus && (
        <div className={`fixed top-6 right-6 z-50 flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border animate-in slide-in-from-top-2 fade-in duration-300 ${
          saveStatus.type === 'success'
            ? darkMode
              ? 'bg-emerald-900/90 border-emerald-700/50 text-emerald-100'
              : 'bg-emerald-50/90 border-emerald-200/50 text-emerald-800'
            : darkMode
              ? 'bg-red-900/90 border-red-700/50 text-red-100'
              : 'bg-red-50/90 border-red-200/50 text-red-800'
        }`}>
          {saveStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="font-medium">{saveStatus.message}</span>
        </div>
      )}

      <div className="relative z-10 flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className={`hidden lg:flex flex-col w-80 min-h-screen border-r backdrop-blur-xl transition-all duration-500 ${
          darkMode 
            ? 'border-slate-700/30 bg-slate-900/80' 
            : 'border-gray-200/30 bg-white/80'
        } py-8 px-6`}>
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className={`p-3 rounded-2xl ${
                darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <SettingsIcon className={`w-8 h-8 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                  darkMode 
                    ? 'from-white via-gray-200 to-gray-300' 
                    : 'from-gray-900 via-gray-800 to-gray-700'
                }`}>
                  Settings
                </h1>
                <p className={`text-sm font-medium ${
                  darkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Manage your account preferences
                </p>
              </div>
            </div>
            <div className={`h-1 w-20 rounded-full bg-gradient-to-r ${
              darkMode ? 'from-blue-400/40 to-purple-400/40' : 'from-blue-500/30 to-purple-500/30'
            }`} />
          </div>
          
          {/* Navigation */}
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
                        ? 'bg-slate-800/60 text-white shadow-lg border border-slate-700/50'
                        : 'bg-white/80 text-gray-900 shadow-lg border border-gray-200/50'
                      : darkMode
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent hover:border-slate-700/30'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 border border-transparent hover:border-gray-200/40'
                  }`}
                  onClick={() => setActiveTab(item.key)}
                >
                  {/* Background gradient for active state */}
                  {isActive && (
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r opacity-10 ${
                      darkMode ? 'from-blue-400 to-purple-400' : 'from-blue-500 to-purple-500'
                    }`} />
                  )}
                  
                  {/* Icon */}
                  <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? darkMode
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-blue-100 text-blue-600'
                      : 'group-hover:scale-110'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{item.label}</div>
                    <div className={`text-xs mt-0.5 ${
                      darkMode ? 'text-slate-500' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${
                      darkMode ? 'from-blue-400 to-purple-400' : 'from-blue-500 to-purple-500'
                    }`} />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-8 px-6 lg:px-8">
          <div className={`max-w-4xl mx-auto backdrop-blur-xl rounded-3xl border shadow-2xl transition-all duration-500 ${
            darkMode 
              ? 'bg-slate-800/40 border-slate-700/30' 
              : 'bg-white/60 border-gray-200/30'
          }`}>
            
            {/* Header */}
            <div className={`px-8 py-6 border-b transition-all duration-300 ${
              darkMode ? 'border-slate-700/30' : 'border-gray-200/30'
            }`}>
              <div className="flex items-center space-x-4">
                {(() => {
                  const currentItem = navItems.find((i) => i.key === activeTab);
                  const Icon = currentItem?.icon;
                  return (
                    <>
                      <div className={`p-3 rounded-2xl ${
                        darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h2 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                          darkMode 
                            ? 'from-white via-gray-200 to-gray-300' 
                            : 'from-gray-900 via-gray-800 to-gray-700'
                        }`}>
                          {currentItem?.label}
                        </h2>
                        <p className={`text-sm font-medium ${
                          darkMode ? 'text-slate-400' : 'text-gray-600'
                        }`}>
                          {currentItem?.description}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Profile */}
              {activeTab === "profile" && (
                <div className="space-y-8">
                  {/* Profile Image Section */}
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative group">
                      {profileImage ? (
                        <img
                          src={URL.createObjectURL(profileImage)}
                          alt="Profile"
                          className="w-32 h-32 rounded-3xl object-cover border-4 border-white/20 shadow-2xl group-hover:scale-105 transition-all duration-300"
                        />
                      ) : (
                        <div className={`w-32 h-32 flex items-center justify-center rounded-3xl border-4 border-dashed transition-all duration-300 group-hover:scale-105 ${
                          darkMode 
                            ? 'bg-slate-700/50 border-slate-600/50 text-slate-400' 
                            : 'bg-gray-100/80 border-gray-300/50 text-gray-500'
                        }`}>
                          <User size={48} />
                        </div>
                      )}
                      
                      {editMode && (
                        <label className={`absolute -bottom-2 -right-2 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-110 ${
                          darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white shadow-lg`}>
                          <Camera className="w-5 h-5" />
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

                    <div className="text-center">
                      <h3 className={`text-xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {profile.firstName && profile.lastName 
                          ? `${profile.firstName} ${profile.lastName}` 
                          : 'Complete your profile'
                        }
                      </h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-gray-600'
                      }`}>
                        {profile.email || 'No email set'}
                      </p>
                    </div>
                  </div>

                  {!editMode ? (
                    <div className="space-y-6">
                      {/* Profile Information Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                          darkMode 
                            ? 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50' 
                            : 'bg-gray-50/80 border-gray-200/50 hover:bg-gray-100/80'
                        }`}>
                          <div className="flex items-center space-x-3 mb-3">
                            <User className={`w-5 h-5 ${
                              darkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                            <label className={`text-sm font-semibold ${
                              darkMode ? 'text-slate-300' : 'text-gray-700'
                            }`}>First Name</label>
                          </div>
                          <p className={`text-lg font-medium ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {profile.firstName || 'Not set'}
                          </p>
                        </div>

                        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                          darkMode 
                            ? 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50' 
                            : 'bg-gray-50/80 border-gray-200/50 hover:bg-gray-100/80'
                        }`}>
                          <div className="flex items-center space-x-3 mb-3">
                            <User className={`w-5 h-5 ${
                              darkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                            <label className={`text-sm font-semibold ${
                              darkMode ? 'text-slate-300' : 'text-gray-700'
                            }`}>Last Name</label>
                          </div>
                          <p className={`text-lg font-medium ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {profile.lastName || 'Not set'}
                          </p>
                        </div>
                      </div>

                      <div className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                        darkMode 
                          ? 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50' 
                          : 'bg-gray-50/80 border-gray-200/50 hover:bg-gray-100/80'
                      }`}>
                        <div className="flex items-center space-x-3 mb-3">
                          <Mail className={`w-5 h-5 ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                          <label className={`text-sm font-semibold ${
                            darkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>Email Address</label>
                        </div>
                        <p className={`text-lg font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {profile.email || 'Not set'}
                        </p>
                      </div>

                      <div className={`pt-6 border-t ${
                        darkMode ? 'border-slate-700/30' : 'border-gray-200/30'
                      }`}>
                        <button
                          className={primaryButtonClass}
                          onClick={() => setEditMode(true)}
                        >
                          <span className="relative z-10 flex items-center space-x-2">
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Profile</span>
                          </span>
                          <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSave} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-semibold mb-3 ${
                            darkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>First Name *</label>
                          <input
                            type="text"
                            className={inputClass}
                            value={profile.firstName}
                            onChange={(e) =>
                              setProfile((prev) => ({ ...prev, firstName: e.target.value }))
                            }
                            placeholder="Enter your first name"
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-semibold mb-3 ${
                            darkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>Last Name *</label>
                          <input
                            type="text"
                            className={inputClass}
                            value={profile.lastName}
                            onChange={(e) =>
                              setProfile((prev) => ({ ...prev, lastName: e.target.value }))
                            }
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-semibold mb-3 ${
                          darkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}>Email Address</label>
                        <input
                          type="email"
                          className={`${inputClass} ${
                            darkMode ? 'bg-slate-700/30 cursor-not-allowed opacity-60' : 'bg-gray-100/60 cursor-not-allowed opacity-60'
                          }`}
                          value={profile.email}
                          disabled
                          placeholder="Email cannot be changed"
                        />
                        <p className={`text-xs mt-2 flex items-center space-x-2 ${
                          darkMode ? 'text-slate-400' : 'text-gray-500'
                        }`}>
                          <Lock className="w-3 h-3" />
                          <span>Email address cannot be modified for security reasons</span>
                        </p>
                      </div>
                      
                      <div className="flex gap-4 pt-6">
                        <button type="submit" className={primaryButtonClass}>
                          <span className="relative z-10 flex items-center space-x-2">
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </span>
                          <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                        <button
                          type="button"
                          className={secondaryButtonClass}
                          onClick={() => setEditMode(false)}
                        >
                          <span className="relative z-10 flex items-center space-x-2">
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Academic Info */}
              {activeTab === "academic" && (
                <form className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                          darkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}>
                          <Building className="w-4 h-4" />
                          <span>Institute Name</span>
                        </label>
                        <input type="text" className={inputClass} placeholder="Enter your institute name" />
                      </div>
                      
                      <div>
                        <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                          darkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}>
                          <GraduationCap className="w-4 h-4" />
                          <span>Branch/Department</span>
                        </label>
                        <input type="text" className={inputClass} placeholder="e.g., Computer Science Engineering" />
                      </div>
                      
                      <div>
                        <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                          darkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}>
                          <UserCircle className="w-4 h-4" />
                          <span>URN/Roll Number</span>
                        </label>
                        <input type="text" className={inputClass} placeholder="Enter your unique registration number" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                            darkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>
                            <Calendar className="w-4 h-4" />
                            <span>Current Year</span>
                          </label>
                          <select className={inputClass}>
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                            darkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>
                            <Calendar className="w-4 h-4" />
                            <span>Current Semester</span>
                          </label>
                          <select className={inputClass}>
                            <option value="">Select Semester</option>
                            <option value="1">Semester 1</option>
                            <option value="2">Semester 2</option>
                            <option value="3">Semester 3</option>
                            <option value="4">Semester 4</option>
                            <option value="5">Semester 5</option>
                            <option value="6">Semester 6</option>
                            <option value="7">Semester 7</option>
                            <option value="8">Semester 8</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                          darkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}>
                          <Award className="w-4 h-4" />
                          <span>Grading System</span>
                        </label>
                        <select className={inputClass}>
                          <option value="">Select Grading System</option>
                          <option value="cgpa">CGPA (10 Point Scale)</option>
                          <option value="gpa">GPA (4 Point Scale)</option>
                          <option value="percentage">Percentage</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`pt-8 border-t ${
                    darkMode ? 'border-slate-700/30' : 'border-gray-200/30'
                  }`}>
                    <button className={primaryButtonClass}>
                      <span className="relative z-10 flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Save Academic Information</span>
                      </span>
                      <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                  </div>
                </form>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-8">
                  <div className={`p-6 rounded-2xl border ${
                    darkMode 
                      ? 'bg-slate-700/20 border-slate-600/30' 
                      : 'bg-gray-50/50 border-gray-200/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${
                          darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                        }`}>
                          <Mail className={`w-5 h-5 ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>Email Notifications</h3>
                          <p className={`text-sm mt-1 ${
                            darkMode ? 'text-slate-400' : 'text-gray-600'
                          }`}>
                            Receive important updates and reminders via email
                          </p>
                          <div className={`mt-2 text-xs ${
                            darkMode ? 'text-slate-500' : 'text-gray-500'
                          }`}>
                            • Assignment deadlines • Exam schedules • Grade updates
                          </div>
                        </div>
                      </div>
                      <Toggle
                        checked={notifEmail}
                        onChange={() => setNotifEmail(!notifEmail)}
                        darkMode={darkMode}
                      />
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl border ${
                    darkMode 
                      ? 'bg-slate-700/20 border-slate-600/30' 
                      : 'bg-gray-50/50 border-gray-200/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${
                          darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                        }`}>
                          <Smartphone className={`w-5 h-5 ${
                            darkMode ? 'text-purple-400' : 'text-purple-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>Push Notifications</h3>
                          <p className={`text-sm mt-1 ${
                            darkMode ? 'text-slate-400' : 'text-gray-600'
                          }`}>
                            Get instant notifications in your browser
                          </p>
                          <div className={`mt-2 text-xs ${
                            darkMode ? 'text-slate-500' : 'text-gray-500'
                          }`}>
                            • Real-time alerts • Calendar reminders • System updates
                          </div>
                        </div>
                      </div>
                      <Toggle
                        checked={notifPush}
                        onChange={() => setNotifPush(!notifPush)}
                        darkMode={darkMode}
                      />
                    </div>
                  </div>

                  <div className={`pt-6 border-t ${
                    darkMode ? 'border-slate-700/30' : 'border-gray-200/30'
                  }`}>
                    <button className={primaryButtonClass}>
                      <span className="relative z-10 flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Save Notification Preferences</span>
                      </span>
                      <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance */}
              {activeTab === "appearance" && (
                <div className="space-y-8">
                  <div className={`p-8 rounded-2xl border ${
                    darkMode 
                      ? 'bg-slate-700/20 border-slate-600/30' 
                      : 'bg-gray-50/50 border-gray-200/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-4 rounded-xl ${
                          darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
                        }`}>
                          {darkMode ? (
                            <Moon className={`w-6 h-6 ${
                              darkMode ? 'text-yellow-400' : 'text-yellow-600'
                            }`} />
                          ) : (
                            <Sun className={`w-6 h-6 ${
                              darkMode ? 'text-yellow-400' : 'text-yellow-600'
                            }`} />
                          )}
                        </div>
                        <div>
                          <h3 className={`text-xl font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {darkMode ? 'Dark Mode' : 'Light Mode'}
                          </h3>
                          <p className={`text-sm mt-2 ${
                            darkMode ? 'text-slate-400' : 'text-gray-600'
                          }`}>
                            {darkMode 
                              ? 'Switch to light mode for better visibility in bright environments'
                              : 'Switch to dark mode for reduced eye strain in low-light conditions'
                            }
                          </p>
                          <div className={`mt-3 text-xs ${
                            darkMode ? 'text-slate-500' : 'text-gray-500'
                          }`}>
                            • Automatic theme detection • Reduced eye strain • Better battery life
                          </div>
                        </div>
                      </div>
                      <Toggle
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                        darkMode={darkMode}
                      />
                    </div>
                  </div>

                  <div className={`pt-6 border-t ${
                    darkMode ? 'border-slate-700/30' : 'border-gray-200/30'
                  }`}>
                    <button className={primaryButtonClass}>
                      <span className="relative z-10 flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Save Appearance Settings</span>
                      </span>
                      <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div className="space-y-8">
                  {/* Change Password Section */}
                  <div className={`p-6 rounded-2xl border ${
                    darkMode 
                      ? 'bg-slate-700/20 border-slate-600/30' 
                      : 'bg-gray-50/50 border-gray-200/50'
                  }`}>
                    <div className="flex items-center space-x-3 mb-6">
                      <Lock className={`w-6 h-6 ${
                        darkMode ? 'text-red-400' : 'text-red-600'
                      }`} />
                      <h3 className={`text-xl font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Change Password</h3>
                    </div>
                    
                    <form className="space-y-6">
                      <div>
                        <label className={`block text-sm font-semibold mb-3 ${
                          darkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}>Current Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword.current ? "text" : "password"} 
                            className={`${inputClass} pr-12`}
                            placeholder="Enter your current password"
                          />
                          <button
                            type="button"
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                              darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                          >
                            {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-semibold mb-3 ${
                          darkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}>New Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword.new ? "text" : "password"} 
                            className={`${inputClass} pr-12`}
                            placeholder="Enter your new password"
                          />
                          <button
                            type="button"
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                              darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                          >
                            {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-semibold mb-3 ${
                          darkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}>Confirm New Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword.confirm ? "text" : "password"} 
                            className={`${inputClass} pr-12`}
                            placeholder="Confirm your new password"
                          />
                          <button
                            type="button"
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                              darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                          >
                            {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <button className={dangerButtonClass}>
                        <span className="relative z-10 flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Update Password</span>
                        </span>
                        <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </button>
                    </form>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className={`p-6 rounded-2xl border ${
                    darkMode 
                      ? 'bg-slate-700/20 border-slate-600/30' 
                      : 'bg-gray-50/50 border-gray-200/50'
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${
                          darkMode ? 'bg-green-500/20' : 'bg-green-100'
                        }`}>
                          <Shield className={`w-6 h-6 ${
                            darkMode ? 'text-green-400' : 'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>Two-Factor Authentication</h3>
                          <p className={`text-sm mt-1 ${
                            darkMode ? 'text-slate-400' : 'text-gray-600'
                          }`}>
                            Add an extra layer of security to your account
                          </p>
                          <div className={`mt-2 text-xs ${
                            darkMode ? 'text-slate-500' : 'text-gray-500'
                          }`}>
                            • Enhanced account protection • Backup recovery options • Security alerts
                          </div>
                        </div>
                      </div>
                      <Toggle
                        checked={twoFactorEnabled}
                        onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        darkMode={darkMode}
                      />
                    </div>

                    {twoFactorEnabled && (
                      <div className="space-y-6 mt-6 pt-6 border-t border-slate-600/20">
                        <div>
                          <label className={`block text-sm font-semibold mb-3 ${
                            darkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>Backup Email</label>
                          <input 
                            type="email" 
                            className={inputClass} 
                            placeholder="backup@example.com" 
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-semibold mb-3 ${
                            darkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>Security Question</label>
                          <select className={inputClass}>
                            <option value="">Choose a security question</option>
                            <option value="school">What is your first school name?</option>
                            <option value="nickname">What was your childhood nickname?</option>
                            <option value="teacher">What is your favorite teacher's name?</option>
                            <option value="pet">What was the name of your first pet?</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-semibold mb-3 ${
                            darkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>Security Answer</label>
                          <input 
                            type="text" 
                            className={inputClass} 
                            placeholder="Enter your answer" 
                          />
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
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;