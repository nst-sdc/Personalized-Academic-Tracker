// components/settings/SaveStatusNotification.jsx
import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const SaveStatusNotification = ({ saveStatus, darkMode }) => {
  if (!saveStatus) return null;

  const isSuccess = saveStatus.type === "success";

  const baseClasses = `fixed top-6 right-6 z-50 flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border animate-in slide-in-from-top-2 fade-in duration-300`;

  const colorClasses = isSuccess
    ? darkMode
      ? "bg-emerald-900/90 border-emerald-700/50 text-emerald-100"
      : "bg-emerald-50/90 border-emerald-200/50 text-emerald-800"
    : darkMode
    ? "bg-red-900/90 border-red-700/50 text-red-100"
    : "bg-red-50/90 border-red-200/50 text-red-800";

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      {isSuccess ? (
        <CheckCircle className="w-5 h-5 text-emerald-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}
      <span className="font-medium">{saveStatus.message}</span>
    </div>
  );
};

export default SaveStatusNotification;
