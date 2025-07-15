import React from "react";
import { Plus, Download, BarChart3 } from "lucide-react";

export default function Header({ darkMode, onAddClick }) {
  return (
    <div className={`backdrop-blur-xl rounded-3xl border mb-8 ${
      darkMode 
        ? "bg-slate-800/40 border-slate-700/30" 
        : "bg-white/60 border-gray-200/30"
    }`}>
      <div className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Title */}
          <div className="flex items-center space-x-4 mb-6 lg:mb-0">
            <div className={`p-4 rounded-2xl ${
              darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <BarChart3 className={`w-8 h-8 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                darkMode 
                  ? "from-white via-gray-200 to-gray-300" 
                  : "from-gray-900 via-gray-800 to-gray-700"
              }`}>
                Academic Tracker
              </h1>
              <p className={`text-sm font-medium mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Monitor your academic progress and performance
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onAddClick}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Grade</span>
              </span>
              <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

            <button className={`group relative overflow-hidden px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              darkMode 
                ? "bg-slate-700/50 hover:bg-slate-600/60 text-gray-300 hover:text-white border border-slate-600/30" 
                : "bg-white/60 hover:bg-white/80 text-gray-700 hover:text-gray-900 border border-gray-200/50 shadow-sm hover:shadow-md"
            }`}>
              <span className="relative z-10 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
