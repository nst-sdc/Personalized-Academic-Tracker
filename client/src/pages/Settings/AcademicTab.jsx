// components/settings/AcademicTab.jsx
import React from "react";
import { Building, GraduationCap, UserCircle, Calendar, Award, Save } from "lucide-react";

const AcademicTab = ({ darkMode }) => {
  const inputClass = `group relative w-full px-4 py-3.5 border rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 placeholder:transition-colors ${
    darkMode
      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 hover:bg-slate-800/70 focus:bg-slate-800/70'
      : 'bg-white/80 border-gray-200/60 text-gray-900 placeholder-gray-500 hover:bg-white focus:bg-white shadow-sm hover:shadow-md'
  }`;

  const buttonClass = `group relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] ${
    darkMode ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'
  }`;

  const primaryButtonClass = `${buttonClass} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl shadow-blue-500/25`;

  return (
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
                {[...Array(8)].map((_, i) => (
                  <option key={i} value={i + 1}>{`Semester ${i + 1}`}</option>
                ))}
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

      <div
        className={`pt-8 border-t ${darkMode ? 'border-slate-700/30' : 'border-gray-200/30'}`}
      >
        <button className={primaryButtonClass}>
          <span className="relative z-10 flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Academic Information</span>
          </span>
          <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </form>
  );
};

export default AcademicTab;
