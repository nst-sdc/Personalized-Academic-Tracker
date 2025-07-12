import React, { useState } from "react";

const semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"];
const gradeOptions = ["A+", "A", "B+", "B", "C+", "C"];

const GradeForm = () => {
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
    <div className="p-6 max-w-6xl mx-auto">
      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6">
        <select name="semester" value={data.semester} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Select Semester</option>
          {semesters.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input
          name="date"
          type="date"
          value={data.date}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="courseName"
          placeholder="Course Name"
          value={data.courseName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="assignmentTitle"
          placeholder="Assignment Title"
          value={data.assignmentTitle}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="marks"
          placeholder="Marks"
          type="number"
          value={data.marks}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select name="expectedGrade" value={data.expectedGrade} onChange={handleChange} className="border p-2 rounded">
          <option value="">Expected Grade</option>
          {gradeOptions.map((g) => <option key={g}>{g}</option>)}
        </select>
        <select name="finalGrade" value={data.finalGrade} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Final Grade</option>
          {gradeOptions.map((g) => <option key={g}>{g}</option>)}
        </select>
        
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Details</button>
      </form>

      {/* Filters */}
      
      <div className="flex flex-wrap gap-4 mb-6">
      <select
        name="month"
        onChange={handleFilterChange}
        className="border p-2 rounded"
      >
        <option value="All">All Months</option>
        {[
          ...new Set(
            grades.map((g) =>
              new Date(g.date).toLocaleString("default", { month: "long" })
            )
          ),
        ].map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      <select
        name="finalGrade"
        value={filters.finalGrade}
        onChange={handleFilterChange}
        className="border p-2 rounded"
      >
        <option value="All">All Grades</option>
        {gradeOptions.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <select
        name="sortMarks"
        value={filters.sortMarks || ""}
        onChange={handleFilterChange}
        className="border p-2 rounded"
      >
        <option value="">Sort by Marks</option>
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
      </select>
      </div>

      <div className="overflow-auto rounded shadow">
        <table className="w-full table-auto text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Semester</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Course Name</th>
              <th className="border px-2 py-1">Assignment Title</th>
              <th className="border px-2 py-1">Marks</th>
              <th className="border px-2 py-1">Expected Grade</th>
              <th className="border px-2 py-1">Final Grade</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrades.map((grade, index) => (
              <tr key={index} className="text-center">
                <td className="border px-2 py-1">{grade.semester}</td>
                <td className="border px-2 py-1">{grade.date}</td>
                <td className="border px-2 py-1">{grade.courseName}</td>
                <td className="border px-2 py-1">{grade.assignmentTitle}</td>
                <td className="border px-2 py-1">{grade.marks}</td>
                <td className="border px-2 py-1">{grade.expectedGrade}</td>
                <td className="border px-2 py-1">{grade.finalGrade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeForm;
