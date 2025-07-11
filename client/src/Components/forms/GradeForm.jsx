import React, { useState } from "react";

const semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"];
const gradeOptions = ["A+", "A", "B+", "B", "C+", "C"];

const GradeForm = ({ darkMode = false }) => {
  const [data, setData] = useState({
    semester: "",
    date: "",
    courseName: "",
    assignmentTitle: "",
    marks: "",
    expectedGrade: "",
    finalGrade: "",
  });

  const [grades, setGrades] = useState([]);
  const [filters, setFilters] = useState({
    finalGrade: "All",
    month: "All",
    sortMarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGrades((prev) => [...prev, data]);
    setData({
      semester: "",
      date: "",
      courseName: "",
      assignmentTitle: "",
      marks: "",
      expectedGrade: "",
      finalGrade: "",
    });
  };

  const filteredGrades = [...grades]
    .filter((grade) => {
      const month = new Date(grade.date).toLocaleString("default", { month: "long" });
      return (
        (filters.finalGrade === "All" || grade.finalGrade === filters.finalGrade) &&
        (filters.month === "All" || month === filters.month)
      );
    })
    .sort((a, b) => {
      if (filters.sortMarks === "asc") return a.marks - b.marks;
      if (filters.sortMarks === "desc") return b.marks - a.marks;
      return 0;
    });

  return (
    <div className={`p-6 max-w-6xl mx-auto transition-colors duration-300 ${darkMode ? "bg-slate-900/95 text-white" : "bg-white text-black"}`}>
      {/* Form */}
      <form onSubmit={handleSubmit} className={`grid grid-cols-2 gap-4 p-4 rounded shadow mb-6 transition-colors duration-300 ${darkMode ? "bg-slate-900/95 text-white" : "bg-white text-black"}`}>
        <select name="semester" value={data.semester} onChange={handleChange} className={`border p-2 rounded ${darkMode ? "bg-slate-800/50 text-white border-gray-600" : "border-gray-300"}`} required>
          <option value="">Select Semester</option>
          {semesters.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input
          name="date"
          type="date"
          value={data.date}
          onChange={handleChange}
          className={`border p-2 rounded ${darkMode ? "bg-slate-800/50 text-white border-gray-600" : "border-gray-300 text-black"}`}
          required
        />
        <input
          name="courseName"
          placeholder="Course Name"
          value={data.courseName}
          onChange={handleChange}
          className={`border p-2 rounded ${darkMode ? "bg-slate-800/50 text-white border-gray-600" : "border-gray-300 text-black"}`}
          required
        />
        <input
          name="assignmentTitle"
          placeholder="Assignment Title"
          value={data.assignmentTitle}
          onChange={handleChange}
          className={`border p-2 rounded ${darkMode ? "bg-slate-800/50 text-white border-gray-600" : "border-gray-300 text-black"}`}
          required
        />
        <input
          name="marks"
          placeholder="Marks"
          type="number"
          value={data.marks}
          onChange={handleChange}
          className={`border p-2 rounded ${darkMode ? "bg-slate-800/50 text-white border-gray-600" : "border-gray-300 text-black"}`}
          required
        />
        <select name="expectedGrade" value={data.expectedGrade} onChange={handleChange} className={`border p-2 rounded ${darkMode ? "bg-slate-800/50 text-white border-gray-600" : "border-gray-300"}`}>
          <option value="">Expected Grade</option>
          {gradeOptions.map((g) => <option key={g}>{g}</option>)}
        </select>
        <select name="finalGrade" value={data.finalGrade} onChange={handleChange} className={`border p-2 rounded ${darkMode ? "bg-slate-800/50 text-white border-gray-600" : "border-gray-300"}`} required>
          <option value="">Final Grade</option>
          {gradeOptions.map((g) => <option key={g}>{g}</option>)}
        </select>
        
       <button
          type="submit"
          className="col-span-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          Add Details
        </button>

      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          name="month"
          onChange={handleFilterChange}
          className={`border p-2 rounded ${darkMode ? "bg-slate-800/50 text-white border-gray-600" : "border-gray-300"}`}
        >
          <option value="All">All Months</option>
          {[...new Set(grades.map((g) => new Date(g.date).toLocaleString("default", { month: "long" })))]
            .map((month) => (
              <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <select
          name="finalGrade"
          value={filters.finalGrade}
          onChange={handleFilterChange}
          className={`border p-2 rounded ${darkMode ? "bg-slate-800/50 text-white border-gray-600" : "border-gray-300"}`}
        >
          <option value="All">All Grades</option>
          {gradeOptions.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select
          name="sortMarks"
          value={filters.sortMarks || ""}
          onChange={handleFilterChange}
          className={`border p-2 rounded ${darkMode ? "bg-slate-800/50 text-white border-gray-600" : "border-gray-300"}`}
        >
          <option value="">Sort by Marks</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded shadow">
        <table className={`w-full table-auto text-sm border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
          <thead className={`${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
            <tr>
              {["Semester", "Date", "Course Name", "Assignment Title", "Marks", "Expected Grade", "Final Grade"].map((th) => (
                <th key={th} className={`border px-2 py-1 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredGrades.map((grade, index) => (
              <tr key={index} className="text-center">
                <td className={`border px-2 py-1 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{grade.semester}</td>
                <td className={`border px-2 py-1 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{grade.date}</td>
                <td className={`border px-2 py-1 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{grade.courseName}</td>
                <td className={`border px-2 py-1 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{grade.assignmentTitle}</td>
                <td className={`border px-2 py-1 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{grade.marks}</td>
                <td className={`border px-2 py-1 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{grade.expectedGrade}</td>
                <td className={`border px-2 py-1 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{grade.finalGrade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeForm;
