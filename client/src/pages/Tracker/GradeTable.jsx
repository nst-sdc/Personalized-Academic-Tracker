import React from "react";
import { Edit3, Trash2, BookOpen } from "lucide-react";
import {
  gradePoints,
  gradeColors,
  gradeDarkColors,
  getAuthToken,
  getAuthHeaders
} from "./utils";

export default function GradeTable({
  grades,
  setGrades,
  filters,
  searchTerm,
  darkMode,
  onEdit
}) {
  const handleDelete = async (id) => {
    const token = getAuthToken();
    if (!token) {
      alert("Please login to delete grades");
      return;
    }

    if (!confirm("Are you sure you want to delete this grade?")) return;

    try {
      const res = await fetch(`http://localhost:3001/api/grades/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include"
      });

      if (!res.ok) {
        alert("Failed to delete grade");
        return;
      }

      // Use both _id and id for compatibility
      setGrades((prev) => prev.filter((g) => g.id !== id && g._id !== id));
    } catch (err) {
      console.error("Error deleting grade:", err);
      alert("Network error while deleting grade");
    }
  };

  const filteredGrades = React.useMemo(() => {
    let filtered = grades.filter((grade) => {
      const month = grade.date
        ? new Date(grade.date).toLocaleString("default", { month: "long" })
        : "";
      const matchesSearch =
        (grade.courseName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (grade.assignmentTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      return (
        matchesSearch &&
        (filters.semester === "All" || grade.semester === filters.semester) &&
        (filters.finalGrade === "All" || grade.finalGrade === filters.finalGrade) &&
        (filters.month === "All" || month === filters.month)
      );
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (filters.sortBy) {
        case "marks":
          aVal = Number(a.marks) || 0;
          bVal = Number(b.marks) || 0;
          break;
        case "grade":
          aVal = gradePoints[a.finalGrade] || 0;
          bVal = gradePoints[b.finalGrade] || 0;
          break;
        case "course":
          aVal = a.courseName?.toLowerCase() || "";
          bVal = b.courseName?.toLowerCase() || "";
          break;
        default:
          aVal = new Date(a.date || 0);
          bVal = new Date(b.date || 0);
      }
      return filters.sortOrder === "asc" ? 
        (typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal) : 
        (typeof aVal === 'string' ? bVal.localeCompare(aVal) : bVal - aVal);
    });

    return filtered;
  }, [grades, filters, searchTerm]);

  return (
    <div
      className={`backdrop-blur-xl rounded-2xl border overflow-hidden ${
        darkMode
          ? "bg-slate-800/40 border-slate-700/30"
          : "bg-white/60 border-gray-200/30"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className={`${
              darkMode ? "bg-slate-700/50" : "bg-gray-50/80"
            }`}
          >
            <tr>
              {[
                "Course",
                "Assignment",
                "Date",
                "Score",
                "Grade",
                "Expected",
                "Credits",
                "Actions"
              ].map((header) => (
                <th
                  key={header}
                  className={`px-6 py-4 text-left text-sm font-semibold ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/20">
            {filteredGrades.map((grade) => {
              // Handle both _id and id for compatibility
              const gradeId = grade.id || grade._id;
              const marks = Number(grade.marks) || 0;
              const maxMarks = Number(grade.maxMarks) || 1; // Avoid division by zero
              const percentage = maxMarks > 0 ? ((marks / maxMarks) * 100).toFixed(1) : "0.0";
              
              return (
                <tr
                  key={gradeId}
                  className={`group transition-colors duration-200 ${
                    darkMode ? "hover:bg-slate-700/30" : "hover:bg-gray-50/50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {grade.courseName || "N/A"}
                      </div>
                      <div
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {grade.semester || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {grade.assignmentTitle || "N/A"}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {grade.date ? new Date(grade.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {marks}/{maxMarks}
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {percentage}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                        grade.finalGrade && (darkMode
                          ? gradeDarkColors[grade.finalGrade]
                          : gradeColors[grade.finalGrade]) || 
                        (darkMode ? "text-gray-400 bg-gray-500/10 border-gray-500/20" : "text-gray-600 bg-gray-100 border-gray-200")
                      }`}
                    >
                      {grade.finalGrade || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {grade.expectedGrade || "N/A"}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {grade.credits || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => onEdit(grade)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          darkMode
                            ? "text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(gradeId)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          darkMode
                            ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                            : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredGrades.length === 0 && (
        <div className="text-center py-12">
          <BookOpen
            className={`w-12 h-12 mx-auto mb-4 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          />
          <p
            className={`text-lg font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No grades found
          </p>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Add your first grade to start tracking your academic progress
          </p>
        </div>
      )}
    </div>
  );
}