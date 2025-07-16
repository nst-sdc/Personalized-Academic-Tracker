// components/settings/ProfileTab.jsx
import React from "react";
import { User, Camera, Edit3, Save, X, Mail, Lock } from "lucide-react";

const ProfileTab = ({
  profile,
  setProfile,
  user,
  profileImage,
  setProfileImage,
  editMode,
  setEditMode,
  handleSaveStatus,
  darkMode
}) => {
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

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      handleSaveStatus("error", "First name and last name are required");
      return;
    }

    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token || !user) {
        handleSaveStatus("error", "No authentication token found");
        return;
      }

      const updateData = {
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
      };

      const response = await fetch(`/api/auth/profile/${user.id || user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      if (data.success) {
        const updatedUser = {
          ...user,
          firstName: profile.firstName.trim(),
          lastName: profile.lastName.trim(),
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        setEditMode(false);
        handleSaveStatus("success", "Profile updated successfully");
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      handleSaveStatus("error", "Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile image */}
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
                ? "bg-slate-700/50 border-slate-600/50 text-slate-400"
                : "bg-gray-100/80 border-gray-300/50 text-gray-500"
            }`}>
              <User size={48} />
            </div>
          )}

          {editMode && (
            <label
              className={`absolute -bottom-2 -right-2 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-110 ${
                darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
              } text-white shadow-lg`}
            >
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
          <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {profile.firstName && profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : "Complete your profile"}
          </h3>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-600"}`}>{profile.email || "No email set"}</p>
        </div>
      </div>

      {editMode ? (
        <form onSubmit={handleProfileSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                First Name *
              </label>
              <input
                type="text"
                className={inputClass}
                value={profile.firstName}
                onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                Last Name *
              </label>
              <input
                type="text"
                className={inputClass}
                value={profile.lastName}
                onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-3 ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
              Email Address
            </label>
            <input
              type="email"
              className={`${inputClass} ${
                darkMode
                  ? "bg-slate-700/30 cursor-not-allowed opacity-60"
                  : "bg-gray-100/60 cursor-not-allowed opacity-60"
              }`}
              value={profile.email}
              disabled
              placeholder="Email cannot be changed"
            />
            <p className={`text-xs mt-2 flex items-center space-x-2 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
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
      ) : (
        <div className="pt-6">
          <button className={primaryButtonClass} onClick={() => setEditMode(true)}>
            <span className="relative z-10 flex items-center space-x-2">
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </span>
            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
