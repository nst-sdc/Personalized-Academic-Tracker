import React from "react";
import { Award, BookOpen, Target, TrendingUp } from "lucide-react";

export default function Statistics({ stats, darkMode }) {
  const cards = [
    {
      label: "Current GPA",
      value: stats.gpa,
      icon: Award,
      color: "blue",
      description: "Overall grade point average"
    },
    {
      label: "Total Credits",
      value: stats.totalCredits,
      icon: BookOpen,
      color: "green",
      description: "Credits completed"
    },
    {
      label: "Average Score",
      value: `${stats.averageMarks}%`,
      icon: Target,
      color: "purple",
      description: "Average assignment score"
    },
    {
      label: "Assignments",
      value: stats.totalAssignments,
      icon: TrendingUp,
      color: "orange",
      description: "Total assignments tracked"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((stat, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:scale-105 ${
            darkMode
              ? "bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60"
              : "bg-white/60 border-gray-200/30 hover:bg-white/80 shadow-sm hover:shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-xl ${
                stat.color === "blue"
                  ? darkMode
                    ? "bg-blue-500/20"
                    : "bg-blue-100"
                  : stat.color === "green"
                  ? darkMode
                    ? "bg-green-500/20"
                    : "bg-green-100"
                  : stat.color === "purple"
                  ? darkMode
                    ? "bg-purple-500/20"
                    : "bg-purple-100"
                  : darkMode
                  ? "bg-orange-500/20"
                  : "bg-orange-100"
              }`}
            >
              <stat.icon
                className={`w-6 h-6 ${
                  stat.color === "blue"
                    ? darkMode
                      ? "text-blue-400"
                      : "text-blue-600"
                    : stat.color === "green"
                    ? darkMode
                      ? "text-green-400"
                      : "text-green-600"
                    : stat.color === "purple"
                    ? darkMode
                      ? "text-purple-400"
                      : "text-purple-600"
                    : darkMode
                    ? "text-orange-400"
                    : "text-orange-600"
                }`}
              />
            </div>
            <div className="text-right">
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stat.value}
              </p>
            </div>
          </div>
          <div>
            <h3
              className={`font-semibold mb-1 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {stat.label}
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {stat.description}
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
    </div>
  );
}
