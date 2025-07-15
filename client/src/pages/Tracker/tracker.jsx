import React, { useState, useMemo } from "react";
import { 
  Plus, 
  Filter, 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  BookOpen,
  BarChart3,
  Search,
  Download,
  Edit3,
  Trash2,
  X,
  Check
} from "lucide-react";

const semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"];
const gradeOptions = ["A+", "A", "B+", "B", "C+", "C", "D", "F"];

const gradePoints = {
  "A+": 4.0, "A": 4.0, "B+": 3.5, "B": 3.0, 
  "C+": 2.5, "C": 2.0, "D": 1.0, "F": 0.0
};

const gradeColors = {
  "A+": "text-emerald-600 bg-emerald-50 border-emerald-200",
  "A": "text-emerald-600 bg-emerald-50 border-emerald-200",
  "B+": "text-blue-600 bg-blue-50 border-blue-200",
  "B": "text-blue-600 bg-blue-50 border-blue-200",
  "C+": "text-amber-600 bg-amber-50 border-amber-200",
  "C": "text-amber-600 bg-amber-50 border-amber-200",
  "D": "text-orange-600 bg-orange-50 border-orange-200",
  "F": "text-red-600 bg-red-50 border-red-200"
};

const gradeDarkColors = {
  "A+": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "A": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "B+": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "B": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "C+": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "C": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "D": "text-orange-400 bg-orange-500/10 border-orange-500/20",
  "F": "text-red-400 bg-red-500/10 border-red-500/20"
};

export default function Tracker({ darkMode = false }) {
  const [grades, setGrades] = useState([
    {
      id: 1,
      semester: "Sem 1",
      date: "2024-01-15",
      courseName: "Calculus I",
      assignmentTitle: "Midterm Exam",
      marks: 85,
      maxMarks: 100,
      expectedGrade: "A",
      finalGrade: "B+",
      credits: 4
    },
    {
      id: 2,
      semester: "Sem 1",
      date: "2024-01-20",
      courseName: "Physics I",
      assignmentTitle: "Lab Report",
      marks: 92,
      maxMarks: 100,
      expectedGrade: "A+",
      finalGrade: "A",
      credits: 3
    },
    {
      id: 3,
      semester: "Sem 2",
      date: "2024-02-10",
      courseName: "Data Structures",
      assignmentTitle: "Programming Assignment",
      marks: 78,
      maxMarks: 100,
      expectedGrade: "B+",
      finalGrade: "B",
      credits: 4
    }
  ]);

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

  // Calculate statistics
  const statistics = useMemo(() => {
    if (grades.length === 0) return { gpa: 0, totalCredits: 0, averageMarks: 0, totalAssignments: 0 };

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

  // Filter and sort grades
  const filteredGrades = useMemo(() => {
    let filtered = grades.filter(grade => {
      const month = new Date(grade.date).toLocaleString("default", { month: "long" });
      const matchesSearch = grade.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           grade.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch &&
             (filters.semester === "All" || grade.semester === filters.semester) &&
             (filters.finalGrade === "All" || grade.finalGrade === filters.finalGrade) &&
             (filters.month === "All" || month === filters.month);
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (filters.sortBy) {
        case "marks":
          aVal = a.marks;
          bVal = b.marks;
          break;
        case "grade":
          aVal = gradePoints[a.finalGrade] || 0;
          bVal = gradePoints[b.finalGrade] || 0;
          break;
        case "course":
          aVal = a.courseName.toLowerCase();
          bVal = b.courseName.toLowerCase();
          break;
        default:
          aVal = new Date(a.date);
          bVal = new Date(b.date);
      }

      if (filters.sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [grades, filters, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setGrades(prev => prev.map(grade => 
        grade.id === editingId 
          ? { ...formData, id: editingId, marks: Number(formData.marks), maxMarks: Number(formData.maxMarks), credits: Number(formData.credits) }
          : grade
      ));
      setEditingId(null);
    } else {
      const newGrade = {
        ...formData,
        id: Date.now(),
        marks: Number(formData.marks),
        maxMarks: Number(formData.maxMarks),
        credits: Number(formData.credits)
      };
      setGrades(prev => [...prev, newGrade]);
    }
    
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
    setShowAddForm(false);
  };

  const handleEdit = (grade) => {
    setFormData({
      semester: grade.semester,
      date: grade.date,
      courseName: grade.courseName,
      assignmentTitle: grade.assignmentTitle,
      marks: grade.marks.toString(),
      maxMarks: grade.maxMarks.toString(),
      expectedGrade: grade.expectedGrade,
      finalGrade: grade.finalGrade,
      credits: grade.credits.toString()
    });
    setEditingId(grade.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setGrades(prev => prev.filter(grade => grade.id !== id));
  };

  const months = [...new Set(grades.map(g => new Date(g.date).toLocaleString("default", { month: "long" })))];

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
        {/* Header */}
        <div className={`backdrop-blur-xl rounded-3xl border mb-8 ${
          darkMode 
            ? "bg-slate-800/40 border-slate-700/30" 
            : "bg-white/60 border-gray-200/30"
        }`}>
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
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

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAddForm(true)}
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: "Current GPA", 
              value: statistics.gpa, 
              icon: Award, 
              color: "blue",
              description: "Overall grade point average"
            },
            { 
              label: "Total Credits", 
              value: statistics.totalCredits, 
              icon: BookOpen, 
              color: "green",
              description: "Credits completed"
            },
            { 
              label: "Average Score", 
              value: `${statistics.averageMarks}%`, 
              icon: Target, 
              color: "purple",
              description: "Average assignment score"
            },
            { 
              label: "Assignments", 
              value: statistics.totalAssignments, 
              icon: TrendingUp, 
              color: "orange",
              description: "Total assignments tracked"
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:scale-105 ${
                darkMode 
                  ? "bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60" 
                  : "bg-white/60 border-gray-200/30 hover:bg-white/80 shadow-sm hover:shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  stat.color === 'blue' ? (darkMode ? 'bg-blue-500/20' : 'bg-blue-100') :
                  stat.color === 'green' ? (darkMode ? 'bg-green-500/20' : 'bg-green-100') :
                  stat.color === 'purple' ? (darkMode ? 'bg-purple-500/20' : 'bg-purple-100') :
                  (darkMode ? 'bg-orange-500/20' : 'bg-orange-100')
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.color === 'blue' ? (darkMode ? 'text-blue-400' : 'text-blue-600') :
                    stat.color === 'green' ? (darkMode ? 'text-green-400' : 'text-green-600') :
                    stat.color === 'purple' ? (darkMode ? 'text-purple-400' : 'text-purple-600') :
                    (darkMode ? 'text-orange-400' : 'text-orange-600')
                  }`} />
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    {stat.value}
                  </p>
                </div>
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}>
                  {stat.label}
                </h3>
                <p className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  {stat.description}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className={`backdrop-blur-xl rounded-2xl border p-6 mb-8 ${
          darkMode 
            ? "bg-slate-800/40 border-slate-700/30" 
            : "bg-white/60 border-gray-200/30"
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
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
              <Filter className={`w-4 h-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              
              <select
                value={filters.semester}
                onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
                className={`px-3 py-2 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                  darkMode 
                    ? "bg-slate-700/50 border-slate-600/30 text-white" 
                    : "bg-white/60 border-gray-200/50 text-gray-900"
                }`}
              >
                <option value="All">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>

              <select
                value={filters.finalGrade}
                onChange={(e) => setFilters(prev => ({ ...prev, finalGrade: e.target.value }))}
                className={`px-3 py-2 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                  darkMode 
                    ? "bg-slate-700/50 border-slate-600/30 text-white" 
                    : "bg-white/60 border-gray-200/50 text-gray-900"
                }`}
              >
                <option value="All">All Grades</option>
                {gradeOptions.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
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

        {/* Grades Table */}
        <div className={`backdrop-blur-xl rounded-2xl border overflow-hidden ${
          darkMode 
            ? "bg-slate-800/40 border-slate-700/30" 
            : "bg-white/60 border-gray-200/30"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${
                darkMode ? 'bg-slate-700/50' : 'bg-gray-50/80'
              }`}>
                <tr>
                  {[
                    "Course", "Assignment", "Date", "Score", "Grade", 
                    "Expected", "Credits", "Actions"
                  ].map((header) => (
                    <th key={header} className={`px-6 py-4 text-left text-sm font-semibold ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/20">
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className={`group transition-colors duration-200 ${
                    darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50/50'
                  }`}>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {grade.courseName}
                        </div>
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {grade.semester}
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {grade.assignmentTitle}
                    </td>
                    <td className={`px-6 py-4 text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {new Date(grade.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {grade.marks}/{grade.maxMarks}
                      </div>
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {((grade.marks / grade.maxMarks) * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                        darkMode ? gradeDarkColors[grade.finalGrade] : gradeColors[grade.finalGrade]
                      }`}>
                        {grade.finalGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {grade.expectedGrade}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {grade.credits}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleEdit(grade)}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            darkMode 
                              ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10' 
                              : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(grade.id)}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            darkMode 
                              ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' 
                              : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredGrades.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className={`w-12 h-12 mx-auto mb-4 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <p className={`text-lg font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                No grades found
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Add your first grade to start tracking your academic progress
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => {
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
            />
            
            <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-300 ${
              darkMode 
                ? "bg-slate-800/95 border-slate-700/30 backdrop-blur-xl" 
                : "bg-white/95 border-gray-200/30 backdrop-blur-xl"
            }`}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {editingId ? 'Edit Grade' : 'Add New Grade'}
                  </h2>
                  <button
                    onClick={() => {
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
                    className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
                      darkMode 
                        ? "text-gray-400 hover:text-white hover:bg-slate-700/50" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Semester
                      </label>
                      <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                          darkMode 
                            ? "bg-slate-700/50 border-slate-600/30 text-white" 
                            : "bg-white/60 border-gray-200/50 text-gray-900"
                        }`}
                      >
                        <option value="">Select Semester</option>
                        {semesters.map(sem => (
                          <option key={sem} value={sem}>{sem}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                          darkMode 
                            ? "bg-slate-700/50 border-slate-600/30 text-white" 
                            : "bg-white/60 border-gray-200/50 text-gray-900"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Course Name
                      </label>
                      <input
                        type="text"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleInputChange}
                        placeholder="e.g., Calculus I"
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                          darkMode 
                            ? "bg-slate-700/50 border-slate-600/30 text-white placeholder-gray-400" 
                            : "bg-white/60 border-gray-200/50 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Assignment Title
                      </label>
                      <input
                        type="text"
                        name="assignmentTitle"
                        value={formData.assignmentTitle}
                        onChange={handleInputChange}
                        placeholder="e.g., Midterm Exam"
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                          darkMode 
                            ? "bg-slate-700/50 border-slate-600/30 text-white placeholder-gray-400" 
                            : "bg-white/60 border-gray-200/50 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Marks Obtained
                      </label>
                      <input
                        type="number"
                        name="marks"
                        value={formData.marks}
                        onChange={handleInputChange}
                        placeholder="85"
                        min="0"
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                          darkMode 
                            ? "bg-slate-700/50 border-slate-600/30 text-white placeholder-gray-400" 
                            : "bg-white/60 border-gray-200/50 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Maximum Marks
                      </label>
                      <input
                        type="number"
                        name="maxMarks"
                        value={formData.maxMarks}
                        onChange={handleInputChange}
                        placeholder="100"
                        min="1"
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                          darkMode 
                            ? "bg-slate-700/50 border-slate-600/30 text-white placeholder-gray-400" 
                            : "bg-white/60 border-gray-200/50 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Expected Grade
                      </label>
                      <select
                        name="expectedGrade"
                        value={formData.expectedGrade}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                          darkMode 
                            ? "bg-slate-700/50 border-slate-600/30 text-white" 
                            : "bg-white/60 border-gray-200/50 text-gray-900"
                        }`}
                      >
                        <option value="">Select Expected Grade</option>
                        {gradeOptions.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Final Grade
                      </label>
                      <select
                        name="finalGrade"
                        value={formData.finalGrade}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                          darkMode 
                            ? "bg-slate-700/50 border-slate-600/30 text-white" 
                            : "bg-white/60 border-gray-200/50 text-gray-900"
                        }`}
                      >
                        <option value="">Select Final Grade</option>
                        {gradeOptions.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Credits
                      </label>
                      <input
                        type="number"
                        name="credits"
                        value={formData.credits}
                        onChange={handleInputChange}
                        placeholder="3"
                        min="1"
                        max="6"
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                          darkMode 
                            ? "bg-slate-700/50 border-slate-600/30 text-white placeholder-gray-400" 
                            : "bg-white/60 border-gray-200/50 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="submit"
                      className="flex-1 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>{editingId ? 'Update Grade' : 'Add Grade'}</span>
                      </span>
                      <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
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
        )}
      </div>
    </div>
  );
}