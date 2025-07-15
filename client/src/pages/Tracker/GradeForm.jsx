import React from "react";
import { semesters, gradeOptions, getAuthHeaders, getAuthToken, makeAuthenticatedRequest } from "./utils";
import { Check, X } from "lucide-react";

export default function GradeForm({
  formData,
  setFormData,
  editingId,
  setEditingId,
  grades,
  setGrades,
  onClose,
  darkMode
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated before submitting
    const token = getAuthToken();
    if (!token) {
      alert("Please login first to add grades");
      return;
    }

    const gradeData = {
      ...formData,
      marks: Number(formData.marks),
      maxMarks: Number(formData.maxMarks),
      credits: Number(formData.credits),
      date: formData.date
    };

    console.log("Submitting grade data:", gradeData);
    console.log("Authentication token present:", !!token);

    try {
      const url = editingId
        ? `http://localhost:3001/api/grades/${editingId}`
        : "http://localhost:3001/api/grades";
      
      const method = editingId ? "PUT" : "POST";
      const headers = getAuthHeaders();
      
      console.log("Request details:", {
        url,
        method,
        headers,
        hasAuthHeader: !!headers.Authorization
      });

      const res = await fetch(url, {
        method,
        headers,
        credentials: "include",
        body: JSON.stringify(gradeData)
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      if (!res.ok) {
        let errorMessage = `HTTP error! status: ${res.status}`;
        
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
          console.error("Server error:", errorData);
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
        }
        
        throw new Error(errorMessage);
      }

      const result = await res.json();
      console.log("Success response:", result);
      
      // Normalize the response to ensure we have both id and _id for compatibility
      const normalized = { 
        ...result, 
        id: result._id || result.id,
        _id: result._id || result.id
      };

      if (editingId) {
        setGrades((prev) => prev.map((g) => 
          (g.id === editingId || g._id === editingId) ? normalized : g
        ));
        console.log("Grade updated successfully");
      } else {
        setGrades((prev) => [...prev, normalized]);
        console.log("Grade added successfully");
      }

      // Reset form and close
      setFormData({
        semester: "",
        date: "",
        courseName: "",
        assignmentTitle: "",
        marks: "",
        maxMarks: "",
        expectedGrade: "",
        finalGrade: "",
        credits: ""
      });
      setEditingId(null);
      onClose();
    } catch (err) {
      console.error("Error saving grade:", err);
      
      // More specific error messages
      if (err.message.includes("Not authorized") || err.message.includes("Authentication failed")) {
        alert("Authentication failed. Please login again.");
      } else if (err.message.includes("Token expired")) {
        alert("Session expired. Please login again.");
      } else {
        alert(`Error saving grade: ${err.message}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-300 ${
          darkMode
            ? "bg-slate-800/95 border-slate-700/30 backdrop-blur-xl"
            : "bg-white/95 border-gray-200/30 backdrop-blur-xl"
        }`}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {editingId ? "Edit Grade" : "Add New Grade"}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
                darkMode
                  ? "text-gray-400 hover:text-white hover:bg-slate-700/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Semester */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-700/50 border-slate-600/30 text-white"
                      : "bg-white/60 border-gray-200/50 text-gray-900"
                  }`}
                >
                  <option value="">Select Semester</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-700/50 border-slate-600/30 text-white"
                      : "bg-white/60 border-gray-200/50 text-gray-900"
                  }`}
                />
              </div>

              {/* Course Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Course Name
                </label>
                <input
                  type="text"
                  name="courseName"
                  placeholder="e.g., Calculus I"
                  value={formData.courseName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-700/50 border-slate-600/30 text-white"
                      : "bg-white/60 border-gray-200/50 text-gray-900"
                  }`}
                />
              </div>

              {/* Assignment Title */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Assignment Title
                </label>
                <input
                  type="text"
                  name="assignmentTitle"
                  placeholder="e.g., Midterm Exam"
                  value={formData.assignmentTitle}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-700/50 border-slate-600/30 text-white"
                      : "bg-white/60 border-gray-200/50 text-gray-900"
                  }`}
                />
              </div>

              {/* Marks */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Marks Obtained
                </label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-700/50 border-slate-600/30 text-white"
                      : "bg-white/60 border-gray-200/50 text-gray-900"
                  }`}
                />
              </div>

              {/* Max Marks */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Maximum Marks
                </label>
                <input
                  type="number"
                  name="maxMarks"
                  value={formData.maxMarks}
                  onChange={handleChange}
                  min="1"
                  step="0.1"
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-700/50 border-slate-600/30 text-white"
                      : "bg-white/60 border-gray-200/50 text-gray-900"
                  }`}
                />
              </div>

              {/* Expected Grade */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Expected Grade
                </label>
                <select
                  name="expectedGrade"
                  value={formData.expectedGrade}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-700/50 border-slate-600/30 text-white"
                      : "bg-white/60 border-gray-200/50 text-gray-900"
                  }`}
                >
                  <option value="">Select Expected Grade</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Final Grade */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Final Grade
                </label>
                <select
                  name="finalGrade"
                  value={formData.finalGrade}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-700/50 border-slate-600/30 text-white"
                      : "bg-white/60 border-gray-200/50 text-gray-900"
                  }`}
                >
                  <option value="">Select Final Grade</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Credits */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Credits
                </label>
                <input
                  type="number"
                  name="credits"
                  placeholder="3"
                  value={formData.credits}
                  onChange={handleChange}
                  min="1"
                  max="6"
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-700/50 border-slate-600/30 text-white"
                      : "bg-white/60 border-gray-200/50 text-gray-900"
                  }`}
                />
              </div>
            </div>

            {/* Submit / Cancel buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                className="flex-1 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>{editingId ? "Update Grade" : "Add Grade"}</span>
                </span>
                <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className={`flex-1 group relative overflow-hidden px-6 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  darkMode
                    ? "bg-slate-700/50 hover:bg-slate-600/60 text-gray-300 hover:text-white border border-slate-600/30"
                    : "bg-gray-100/60 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900 border border-gray-200/50"
                }`}
              >
                <span className="relative z-10">Cancel</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}