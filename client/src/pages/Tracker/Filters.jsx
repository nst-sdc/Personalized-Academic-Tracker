import React from "react";
import { Search, Filter } from "lucide-react";
import { semesters, gradeOptions } from "./utils";

export default function Filters({ filters, setFilters, searchTerm, setSearchTerm, darkMode }) {
  return (
    <div
      className={`backdrop-blur-xl rounded-2xl border p-6 mb-8 ${
        darkMode
          ? "bg-slate-800/40 border-slate-700/30"
          : "bg-white/60 border-gray-200/30"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="Search courses or assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
              darkMode
                ? "bg-slate-700/50 border-slate-600/30 text-white placeholder-gray-400"
                : "bg-white/60 border-gray-200/50 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <Filter
            className={`w-4 h-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />

          <select
            value={filters.semester}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, semester: e.target.value }))
            }
            className={`px-3 py-2 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
              darkMode
                ? "bg-slate-700/50 border-slate-600/30 text-white"
                : "bg-white/60 border-gray-200/50 text-gray-900"
            }`}
          >
            <option value="All">All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>

          <select
            value={filters.finalGrade}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, finalGrade: e.target.value }))
            }
            className={`px-3 py-2 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
              darkMode
                ? "bg-slate-700/50 border-slate-600/30 text-white"
                : "bg-white/60 border-gray-200/50 text-gray-900"
            }`}
          >
            <option value="All">All Grades</option>
            {gradeOptions.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
            }
            className={`px-3 py-2 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
              darkMode
                ? "bg-slate-700/50 border-slate-600/30 text-white"
                : "bg-white/60 border-gray-200/50 text-gray-900"
            }`}
          >
            <option value="date">Sort by Date</option>
            <option value="marks">Sort by Marks</option>
            <option value="grade">Sort by Grade</option>
            <option value="course">Sort by Course</option>
          </select>
        </div>
      </div>
    </div>
  );
}
