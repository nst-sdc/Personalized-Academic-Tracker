// components/settings/Toggle.jsx
import React from "react";

const Toggle = ({ checked, onChange, darkMode }) => {
  return (
    <div
      onClick={onChange}
      className={`relative w-12 h-7 flex items-center cursor-pointer rounded-full p-1 transition-colors duration-300 ${
        checked
          ? darkMode
            ? 'bg-blue-500/80'
            : 'bg-blue-600'
          : darkMode
          ? 'bg-slate-600/60'
          : 'bg-gray-300'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        } ${darkMode ? 'bg-white' : 'bg-white'}`}
      />
    </div>
  );
};

export default Toggle;
