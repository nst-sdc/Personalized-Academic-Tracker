import React from "react";
import GradeForm from "../Components/forms/GradeForm";

const WorkPage = ({ darkMode }) => {
  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900/95 text-white" : "bg-white text-black"}`}>
      <h1 className="text-2xl font-bold mb-10 text-center">Add Grades</h1>
      <GradeForm darkMode={darkMode} />
    </div>
  );
};

export default WorkPage;