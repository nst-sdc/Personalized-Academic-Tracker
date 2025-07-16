import React, { useState, useEffect, useMemo } from "react";
import Header from "./Header";
import Statistics from "./Statistics";
import Filters from "./Filters";
import GradeTable from "./GradeTable";
import GradeForm from "./GradeForm";
import {
  getAuthToken,
  getAuthHeaders,
  gradePoints
} from "./utils";

export default function Tracker({ darkMode = false }) {
  const [grades, setGrades] = useState([]);
  const [formData, setFormData] = useState({
    semester: "",
    date: "",
    courseName: "",
    assignmentTitle: "",
    marks: "",
    maxMarks: "100",
    expectedGrade: "",
    finalGrade: "",
    credits: ""
  });
  const [filters, setFilters] = useState({
    semester: "All",
    finalGrade: "All",
    month: "All",
    sortBy: "date",
    sortOrder: "desc"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await fetch("http://localhost:3001/api/grades", {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include"
        });

        if (!res.ok) return;
        const data = await res.json();

        if (Array.isArray(data)) {
          const normalized = data.map((g) => ({ ...g, id: g._id }));
          setGrades(normalized);
        }
      } catch (err) {
        console.error("Failed to fetch grades:", err);
      }
    };

    fetchGrades();
  }, []);

  const statistics = useMemo(() => {
    if (!Array.isArray(grades) || grades.length === 0) {
      return { gpa: 0, totalCredits: 0, averageMarks: 0, totalAssignments: 0 };
    }

    const totalPoints = grades.reduce((sum, grade) => {
      return sum + (gradePoints[grade.finalGrade] || 0) * (grade.credits || 1);
    }, 0);

    const totalCredits = grades.reduce((sum, grade) => sum + (grade.credits || 1), 0);
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const averageMarks = grades.reduce((sum, grade) => sum + grade.marks, 0) / grades.length;

    return {
      gpa: gpa.toFixed(2),
      totalCredits,
      averageMarks: averageMarks.toFixed(1),
      totalAssignments: grades.length
    };
  }, [grades]);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header darkMode={darkMode} onAddClick={() => setShowAddForm(true)} />
        <Statistics stats={statistics} darkMode={darkMode} />
        <Filters
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          darkMode={darkMode}
        />
        <GradeTable
          grades={grades}
          setGrades={setGrades}
          filters={filters}
          searchTerm={searchTerm}
          darkMode={darkMode}
          onEdit={(grade) => {
            setFormData({
              semester: grade.semester || "",
              date: grade.date ? new Date(grade.date).toISOString().split("T")[0] : "",
              courseName: grade.courseName || "",
              assignmentTitle: grade.assignmentTitle || "",
              marks: grade.marks?.toString() || "",
              maxMarks: grade.maxMarks?.toString() || "100",
              expectedGrade: grade.expectedGrade || "",
              finalGrade: grade.finalGrade || "",
              credits: grade.credits?.toString() || ""
            });
            setEditingId(grade._id || grade.id);
            setShowAddForm(true);
          }}
        />
        {showAddForm && (
          <GradeForm
            formData={formData}
            setFormData={setFormData}
            editingId={editingId}
            setEditingId={setEditingId}
            grades={grades}
            setGrades={setGrades}
            onClose={() => {
              setShowAddForm(false);
              setEditingId(null);
              setFormData({
                semester: "",
                date: "",
                courseName: "",
                assignmentTitle: "",
                marks: "",
                maxMarks: "100",
                expectedGrade: "",
                finalGrade: "",
                credits: ""
              });
            }}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}