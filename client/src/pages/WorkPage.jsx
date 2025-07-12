import React from "react";
import GradeForm from "../Components/forms/GradeForm";

const WorkPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-10 text-center">Add Grades</h1>
      <GradeForm />
    </div>
  );
};

export default WorkPage;